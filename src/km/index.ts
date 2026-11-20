/**
 * Bundled Khmer content.
 *
 * One overlay per seeded document, written in natural Khmer. The public site
 * merges it beneath the live D1 Khmer overlay (stored translations win), and
 * the admin console uses the same values to prefill the ខ្មែរ tab on every
 * document so a translator starts from finished copy, never a blank form.
 *
 * The file is imported dynamically by the public site (Khmer only) and
 * statically by the admin chunk, so English visitors never download it.
 */

import homepage from "./homepage.json";
import about from "./about.json";
import quality from "./quality.json";
import projects from "./projects.json";
import posts from "./posts.json";
import vacancies from "./vacancies.json";
import resources from "./resources.json";
import businesses from "./businesses.json";
import offerings from "./offerings.json";

export type KmDocument = Record<string, unknown>;
export type KmContent = Record<string, Record<string, KmDocument>>;

const bySlug = (items: unknown[]): Record<string, KmDocument> => {
  const out: Record<string, KmDocument> = {};
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const doc = item as Record<string, unknown>;
    const slug = doc.slug ?? doc.id;
    if (typeof slug === "string" && slug) out[slug] = doc;
  }
  return out;
};

export const kmContent: KmContent = {
  homepage: { home: homepage as KmDocument },
  about: { home: about as KmDocument },
  quality: { home: quality as KmDocument },
  projects: bySlug(projects),
  posts: bySlug(posts),
  vacancies: bySlug(vacancies),
  resources: bySlug(resources),
  businesses: bySlug(businesses),
  offerings: bySlug(offerings),
};

/** The bundled Khmer overlay for one document, or null when none exists yet. */
export const kmFor = (type: string, slug: string): KmDocument | null => kmContent[type]?.[slug] ?? null;
