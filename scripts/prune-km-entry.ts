import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { SCHEMAS } from "../src/admin/adminSchemas";
import { sanitizeKm } from "../src/admin/kmSanitize";

const count = (input: unknown): number =>
  Array.isArray(input)
    ? input.reduce((n, item) => n + count(item), 0)
    : input && typeof input === "object"
      ? Object.values(input as Record<string, unknown>).reduce((n, item) => n + count(item), 0)
      : typeof input === "string"
        ? 1
        : 0;

export async function pruneAll(root: string) {
  for (const schema of Object.values(SCHEMAS)) {
    const file = path.join(root, "src", "km", `${schema.type}.json`);
    let raw: string;
    try {
      raw = await readFile(file, "utf8");
    } catch {
      continue;
    }
    const parsed = JSON.parse(raw) as unknown;
    const pruned = Array.isArray(parsed)
      ? parsed.map((item) => sanitizeKm(schema, item, { keepId: true }))
      : sanitizeKm(schema, parsed, { keepId: true });
    await writeFile(file, `${JSON.stringify(pruned, null, 2)}\n`);
    console.log(`${schema.type}: ${count(parsed)} → ${count(pruned)} strings`);
  }
}
