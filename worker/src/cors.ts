import type { Env } from "./types";

const extras = [
  "https://www.bce-construction.com",
  "https://staging.bce-construction.com",
  "https://bce-construction.pages.dev",
  "http://localhost:8443",
  "http://localhost:5173",
  "http://127.0.0.1:8443",
];

export const allowedOrigins = (env: Env) =>
  [env.PUBLIC_ORIGIN, env.ADMIN_ORIGIN, ...extras].filter(Boolean).map((origin) => origin.replace(/\/$/, ""));

export const corsHeaders = (request: Request, env: Env): Record<string, string> => {
  const origin = request.headers.get("Origin")?.replace(/\/$/, "");
  const allowed = allowedOrigins(env);
  const headers: Record<string, string> = {
    vary: "Origin",
    "access-control-allow-methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, authorization, x-requested-with",
    "access-control-max-age": "86400",
  };
  if (origin && allowed.includes(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-credentials"] = "true";
  }
  return headers;
};

export const withCors = (response: Response, request: Request, env: Env) => {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request, env))) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

export const requestIp = (request: Request) =>
  request.headers.get("CF-Connecting-IP") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
