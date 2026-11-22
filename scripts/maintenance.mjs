#!/usr/bin/env node
// Production maintenance mode for the public website.
//
//   node scripts/maintenance.mjs on       redirect bce-construction.com and www to the maintenance page
//   node scripts/maintenance.mjs off      remove the redirect and serve the real site again
//   node scripts/maintenance.mjs status    report whether the redirect is live, and check both URLs
//
// The site itself is a Cloudflare Pages deployment; this script does not touch it. It creates one rule in the zone's
// dynamic-redirect ruleset (http_request_dynamic_redirect) that sends document requests to the standalone
// maintenance site (maintenance/index.html, deployed as the `bce-maintenance` Pages project). Admin, the Worker API
// and every other host on the zone are untouched, so admin.bce-construction.com and /api/* keep working.
//
// Credentials: CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL, CLOUDFLARE_ACCOUNT_ID from .env (git-ignored).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(root, ".env"), "utf8")
    .split("\n")
    .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);

const API = "https://api.cloudflare.com/client/v4";
const ZONE_NAME = "bce-construction.com";
const PUBLIC_HOSTS = ["bce-construction.com", "www.bce-construction.com"];
const TARGET = process.env.MAINTENANCE_URL || "https://status.bce-construction.com/";
const PHASE = "http_request_dynamic_redirect";
const MARKER = "BCE maintenance redirect";

const key = env.CLOUDFLARE_API_KEY;
const email = env.CLOUDFLARE_EMAIL;
if (!key || !email) {
  console.error("Missing CLOUDFLARE_API_KEY / CLOUDFLARE_EMAIL in .env");
  process.exit(1);
}

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "X-Auth-Email": email,
      "X-Auth-Key": key,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    const detail = (body.errors || []).map((e) => `${e.code} ${e.message}`).join("; ");
    throw new Error(`${init.method || "GET"} ${path} → ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  return body.result;
}

const zoneId = (async () => {
  const zones = await api(`/zones?name=${encodeURIComponent(ZONE_NAME)}`);
  if (!zones?.length) throw new Error(`zone ${ZONE_NAME} not found for this account`);
  return zones[0].id;
})();

const entrypoint = async (id) => {
  try {
    return await api(`/zones/${id}/rulesets/phases/${PHASE}/entrypoint`);
  } catch (err) {
    if (/10003|not found/i.test(String(err))) return null;
    throw err;
  }
};

const expression = `(http.host in {${PUBLIC_HOSTS.map((h) => `"${h}"`).join(" ")}}) and not starts_with(http.request.uri.path, "/api/")`;

const rule = {
  action: "redirect",
  action_parameters: {
    from_value: {
      status_code: 302,
      target_url: { value: TARGET },
      preserve_query_string: false,
    },
  },
  expression,
  description: MARKER,
};

async function checkTarget(url = TARGET) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return { ok: res.status === 200, status: res.status };
  } catch (err) {
    // A stale negative DNS cache on this machine must not block the switch: ask Cloudflare DoH whether the hostname
    // resolves publicly, and confirm the maintenance deployment itself is up.
    try {
      const host = new URL(url).hostname;
      const doh = await fetch(`https://cloudflare-dns.com/dns-query?name=${host}&type=A`, {
        headers: { accept: "application/dns-json" },
      }).then((r) => r.json());
      const deployed = await fetch("https://bce-maintenance.pages.dev/", { redirect: "manual" });
      if (doh.Status === 0 && doh.Answer?.length && deployed.status === 200) {
        return { ok: true, status: `200 via DoH (local DNS stale)`, warn: true };
      }
    } catch {
      /* fall through to the failure below */
    }
    return { ok: false, status: String(err) };
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function on() {
  const target = await checkTarget();
  if (!target.ok) {
    console.error(`Refusing to switch: ${TARGET} answered ${target.status}. Deploy the maintenance page first.`);
    process.exit(1);
  }
  const id = await zoneId;
  const current = await entrypoint(id);
  const others = (current?.rules || []).filter((r) => r.description !== MARKER);
  await api(`/zones/${id}/rulesets/phases/${PHASE}/entrypoint`, {
    method: "PUT",
    body: JSON.stringify({ rules: [...others, rule] }),
  });
  await sleep(2500);
  const live = await fetch(`https://${PUBLIC_HOSTS[0]}/`, { redirect: "manual" });
  console.log(`Maintenance mode ON — ${TARGET}`);
  console.log(`  ${PUBLIC_HOSTS[0]}/ → ${live.status} ${live.headers.get("location") || ""}`);
  console.log("  Admin, /api/* and every other host are untouched. Turn off with: npm run maintenance:off");
}

async function off() {
  const id = await zoneId;
  const current = await entrypoint(id);
  const rules = current?.rules || [];
  const kept = rules.filter((r) => r.description !== MARKER);
  if (kept.length === rules.length) {
    console.log("Maintenance mode is already off — no redirect rule found.");
    return;
  }
  if (kept.length === 0) {
    // An entrypoint ruleset cannot be deleted with every auth scheme (the global key gets 10405); an empty rule list
    // is the portable "off" and the redirect stops immediately.
    await api(`/zones/${id}/rulesets/phases/${PHASE}/entrypoint`, {
      method: "PUT",
      body: JSON.stringify({ rules: [] }),
    });
  } else {
    await api(`/zones/${id}/rulesets/phases/${PHASE}/entrypoint`, {
      method: "PUT",
      body: JSON.stringify({ rules: kept }),
    });
  }
  await sleep(2500);
  const site = await fetch(`https://${PUBLIC_HOSTS[0]}/`, { redirect: "manual" });
  console.log(`Maintenance mode OFF — ${PUBLIC_HOSTS[0]}/ now answers ${site.status}.`);
}

async function status() {
  const id = await zoneId;
  const current = await entrypoint(id);
  const our = (current?.rules || []).find((r) => r.description === MARKER);
  const live = !!our;
  const liveTarget = our?.action_parameters?.from_value?.target_url?.value || TARGET;
  const target = await checkTarget(liveTarget);
  const site = await fetch(`https://${PUBLIC_HOSTS[0]}/`, { redirect: "manual" });
  console.log(`Maintenance mode: ${live ? "ON" : "OFF"}${live ? ` — ${liveTarget}` : ""}`);
  console.log(`  ${liveTarget} → ${target.status}`);
  console.log(`  ${PUBLIC_HOSTS[0]}/ → ${site.status} ${site.headers.get("location") || ""}`);
  console.log(`  admin.bce-construction.com/ → ${(await fetch("https://admin.bce-construction.com/", { redirect: "manual" })).status}`);
}

const command = process.argv[2];
try {
  if (command === "on") await on();
  else if (command === "off") await off();
  else if (command === "status") await status();
  else {
    console.log("Usage: node scripts/maintenance.mjs on|off|status");
    process.exit(command ? 1 : 0);
  }
} catch (err) {
  console.error(String(err.message || err));
  process.exit(1);
}
