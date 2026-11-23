// Keep only the language-specific fields in the bundled Khmer overlays.
//
// The translations mirror the English documents, including paths, hrefs, slugs and
// categories. Those values must always come from the live English document: if a Khmer
// overlay kept a stale image path it would override a newer English one when the site
// merges the two. This script walks each schema and drops every field marked
// `locale: false`, every `skipKm` key, and every non-text field.
//
// Run after editing a schema or a Khmer JSON file:  npm run km:prune

import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const dir = await mkdtemp(path.join(tmpdir(), "bce-km-"));
const entry = path.join(dir, "entry.ts");
const outfile = path.join(dir, "entry.mjs");

const source = `
import { pruneAll } from ${JSON.stringify(path.join(root, "scripts", "prune-km-entry.ts"))};
await pruneAll(${JSON.stringify(root)});
`;
await import("node:fs/promises").then((fs) => fs.writeFile(entry, source));

await build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  outfile,
  logLevel: "error",
  absWorkingDir: root,
});

await import(`${pathToFileURL(outfile).href}?v=${Date.now()}`);
await rm(dir, { recursive: true, force: true });
