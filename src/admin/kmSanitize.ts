import type { ContentSchema, Field } from "./adminSchemas";

// Values that are not language-specific must never live in a Khmer overlay. If they did,
// a stale path, href, colour or category in the overlay would win over a newer English
// value when the site merges the two. The admin sanitises every save with this helper, and
// scripts/prune-km-entry.ts uses it to keep the bundled JSON overlays clean.

const textTypes = new Set(["text", "textarea", "list", "json"]);

const pruneValue = (value: unknown, fields: Field[], skip: string[]): unknown => {
  if (Array.isArray(value)) return value.map((item) => pruneValue(item, fields, skip));
  if (!value || typeof value !== "object") return value;

  const byKey = new Map(fields.map((field) => [field.key, field]));
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (skip.includes(key)) continue;
    const field = byKey.get(key);
    if (!field) {
      // Unknown keys may be content added after this schema; keeping them is safer than
      // dropping a real translation.
      out[key] = item;
      continue;
    }
    if (field.locale === false) continue;
    if (field.type === "group") {
      out[key] = pruneValue(item, field.fields ?? [], []);
      continue;
    }
    if (field.type === "objectList") {
      out[key] = Array.isArray(item) ? item.map((entry) => pruneValue(entry, field.itemFields ?? [], [])) : item;
      continue;
    }
    if (textTypes.has(field.type)) out[key] = item;
    // image, select, number and boolean are never language-specific.
  }
  return out;
};

/** Strip every non-translatable key from a Khmer overlay for this schema. */
export const sanitizeKm = (
  schema: ContentSchema,
  value: unknown,
  options: { keepId?: boolean } = {},
): Record<string, unknown> => {
  const source = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const pruned = pruneValue(source, schema.fields, schema.skipKm ?? []);
  const out = (pruned && typeof pruned === "object" && !Array.isArray(pruned) ? pruned : {}) as Record<string, unknown>;
  // The bundled overlays keep their slug/id so the site and admin can look them up.
  // It is removed again before the overlay is merged over the English document, and
  // the admin never saves it.
  if (options.keepId && source[schema.slugKey] !== undefined) out[schema.slugKey] = source[schema.slugKey];
  return out;
};
