// Build-time content snapshot. Bundled by scripts/export-content.mjs so the
// same TypeScript sources that render the site can seed Cloudflare D1.
import { projects } from "../src/projects";
import { businessDetails } from "../src/businessDetails";
import { offerings } from "../src/company";
import { DEFAULT_HOMEPAGE } from "../src/homepage";
import { DEFAULT_QUALITY } from "../src/quality";
import { DEFAULT_ABOUT } from "../src/about";
import { BLOG_POSTS } from "../src/blogData";
import { VACANCIES } from "../src/careersData";
import { DOCUMENTS } from "../src/resourcesData";
import { DEFAULT_SETTINGS } from "../worker/src/content";
import { kmFor } from "../src/km";

export function getContent() {
  const documents = [
    // Singleton pages use the admin's canonical slug ("home") so a re-seed updates the same row
    // the editor saves, instead of creating a second document of the same type.
    { type: "homepage", slug: "home", sort: 0, data: { ...DEFAULT_HOMEPAGE, title: "Homepage", slug: "home" } },
    { type: "quality", slug: "home", sort: 0, data: { ...DEFAULT_QUALITY, title: "Quality & HSE", slug: "home" } },
    { type: "about", slug: "home", sort: 0, data: { ...DEFAULT_ABOUT, title: "About BCE", slug: "home" } },
    ...projects.map((item, sort) => ({ type: "projects", slug: item.slug, sort, data: item })),
    ...BLOG_POSTS.map((item, sort) => ({ type: "posts", slug: item.slug, sort, data: item })),
    ...VACANCIES.map((item, sort) => ({ type: "vacancies", slug: item.id, sort, data: item })),
    ...DOCUMENTS.map((item, sort) => ({ type: "resources", slug: item.id, sort, data: item })),
    ...businessDetails.map((item, sort) => ({ type: "businesses", slug: item.slug, sort, data: item })),
    ...offerings.map((item, sort) => ({ type: "offerings", slug: item.slug, sort, data: item })),
  ].map((doc) => ({ ...doc, km: kmFor(doc.type, doc.slug) }));
  return { documents, settings: DEFAULT_SETTINGS };
}
