import {
  base64UrlDecode,
  HttpError,
  type AdminIdentity,
  type Env,
} from "./types";

const CERT_TTL_MS = 60 * 60 * 1000; // 1 hour
type AccessJwk = JsonWebKey & { kid?: string };
const certCache = new Map<string, { keys: AccessJwk[]; expires: number }>();

type AccessPayload = {
  aud?: string | string[];
  iss?: string;
  exp?: number;
  iat?: number;
  email?: string;
  sub?: string;
  type?: string;
};

const jsonPart = <T>(part: string): T => JSON.parse(new TextDecoder().decode(base64UrlDecode(part))) as T;

const fetchAccessKeys = async (teamDomain: string, env: Env): Promise<AccessJwk[]> => {
  const cached = certCache.get(teamDomain);
  if (cached && cached.expires > Date.now()) return cached.keys;

  const kvKey = `access-certs:${teamDomain}`;
  let kvMiss = true;

  // KV survives isolate restarts and keeps cold starts off the Access endpoint.
  try {
    const stored = await env.KV.get(kvKey, { cacheTtl: 300 });
    if (stored) {
      const keys = JSON.parse(stored) as AccessJwk[];
      if (Array.isArray(keys) && keys.length) {
        certCache.set(teamDomain, { keys, expires: Date.now() + CERT_TTL_MS });
        kvMiss = false;
        return keys;
      }
    }
  } catch {
    /* fall through to Cache API / network */
  }

  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  const cacheKey = new Request("https://bce-cache.internal/access-certs", { method: "GET" });
  let response: Response | undefined;

  try {
    const cache = (caches as unknown as { default?: Cache }).default;
    const hit = cache ? await cache.match(cacheKey) : undefined;
    if (hit) response = hit;
  } catch {
    /* Cache API is not available in every runtime (e.g. some local modes). */
  }

  if (!response) {
    try {
      response = await fetch(url, { headers: { accept: "application/json" } });
    } catch {
      throw new HttpError(503, "Could not reach Cloudflare Access", "access_unavailable");
    }
    if (!response.ok) throw new HttpError(503, "Could not load Cloudflare Access keys", "access_keys_unavailable");
    const clone = response.clone();
    try {
      const cache = (caches as unknown as { default?: Cache }).default;
      if (cache) await cache.put(cacheKey, clone);
    } catch {
      /* ignore */
    }
  }

  const payload = (await response.json()) as { keys?: AccessJwk[] };
  if (!payload?.keys?.length) throw new HttpError(503, "Cloudflare Access returned no keys", "access_keys_empty");
  certCache.set(teamDomain, { keys: payload.keys, expires: Date.now() + CERT_TTL_MS });
  if (kvMiss) {
    try {
      await env.KV.put(kvKey, JSON.stringify(payload.keys), { expirationTtl: 3600 });
    } catch {
      /* KV write quota or eventual consistency — the in-memory and edge caches still work */
    }
  }
  return payload.keys;
};

const importKey = (jwk: AccessJwk) =>
  crypto.subtle.importKey(
    "jwk",
    { ...jwk, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

export const verifyAccessJwt = async (token: string, env: Env): Promise<AccessPayload> => {
  const parts = token.split(".");
  if (parts.length !== 3) throw new HttpError(401, "Malformed Access token", "invalid_token");

  let header: { alg?: string; kid?: string; typ?: string };
  let payload: AccessPayload;
  try {
    header = jsonPart<{ alg?: string; kid?: string; typ?: string }>(parts[0]);
    payload = jsonPart<AccessPayload>(parts[1]);
  } catch {
    throw new HttpError(401, "Malformed Access token", "invalid_token");
  }

  if (header.alg !== "RS256" || !header.kid) {
    throw new HttpError(401, "Unsupported Access token", "invalid_token");
  }
  if (!payload.exp || payload.exp * 1000 < Date.now()) {
    throw new HttpError(401, "Access token expired", "token_expired");
  }

  const teamDomain = env.ACCESS_TEAM_DOMAIN;
  const expectedIssuer = `https://${teamDomain}`;
  if (payload.iss !== expectedIssuer) {
    throw new HttpError(401, "Access token issuer mismatch", "invalid_issuer");
  }

  const audiences = (Array.isArray(payload.aud) ? payload.aud : [payload.aud]).filter(Boolean) as string[];
  const allowed = env.ACCESS_AUD.split(",").map((s) => s.trim()).filter(Boolean);
  if (!audiences.some((aud) => allowed.includes(aud))) {
    throw new HttpError(401, "Access token audience mismatch", "invalid_audience");
  }

  const keys = await fetchAccessKeys(teamDomain, env);
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new HttpError(401, "Unknown Access signing key", "unknown_key");

  let key: CryptoKey;
  try {
    key = await importKey(jwk);
  } catch {
    throw new HttpError(401, "Access signing key could not be used", "unknown_key");
  }
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      key,
      base64UrlDecode(parts[2]),
      signed,
    );
  } catch {
    throw new HttpError(401, "Access token signature invalid", "invalid_signature");
  }
  if (!valid) throw new HttpError(401, "Access token signature invalid", "invalid_signature");

  if (!payload.email) throw new HttpError(401, "Access token has no email", "no_email");
  return payload;
};

export const adminEmails = (env: Env) =>
  env.ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

/**
 * Resolve the signed-in admin.
 * Production trusts only a cryptographically verified Cloudflare Access JWT.
 * Local development can opt into a fixed identity with DEV_ADMIN_EMAIL.
 */
export const getAdmin = async (request: Request, env: Env): Promise<AdminIdentity | null> => {
  if (env.ENVIRONMENT !== "production" && env.DEV_ADMIN_EMAIL) {
    return { email: env.DEV_ADMIN_EMAIL.toLowerCase(), source: "dev" };
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;

  const payload = await verifyAccessJwt(token, env);
  const email = payload.email!.toLowerCase();
  if (!adminEmails(env).includes(email)) {
    throw new HttpError(403, "This account is not on the BCE admin allowlist", "not_allowed");
  }
  return { email, source: "access" };
};

export const requireAdmin = async (request: Request, env: Env): Promise<AdminIdentity> => {
  const admin = await getAdmin(request, env);
  if (!admin) {
    throw new HttpError(401, "Sign in with Cloudflare Access to continue", "unauthenticated");
  }
  return admin;
};
