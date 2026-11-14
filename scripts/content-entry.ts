// Build-time content snapshot. Bundled by scripts/export-content.mjs so the
// same TypeScript sources that render the site can seed Cloudflare D1.
import { projects } from "../src/projects";
import { businessDetails } from "../src/businessDetails";
import { offerings } from "../src/company";
import { DEFAULT_HOMEPAGE } from "../src/homepage";
import { BLOG_POSTS } from "../src/blogData";
import { VACANCIES } from "../src/careersData";
import { DOCUMENTS } from "../src/resourcesData";
import { DEFAULT_SETTINGS } from "../worker/src/content";

export function getContent() {
  const documents = [
    { type: "homepage", slug: "home", sort: 0, data: { ...DEFAULT_HOMEPAGE, title: "Homepage", slug: "home" } },
    ...projects.map((item, sort) => ({ type: "projects", slug: item.slug, sort, data: item })),
    ...BLOG_POSTS.map((item, sort) => ({ type: "posts", slug: item.slug, sort, data: item })),
    ...VACANCIES.map((item, sort) => ({ type: "vacancies", slug: item.id, sort, data: item })),
    ...DOCUMENTS.map((item, sort) => ({ type: "resources", slug: item.id, sort, data: item })),
    ...businessDetails.map((item, sort) => ({ type: "businesses", slug: item.slug, sort, data: item })),
    ...offerings.map((item, sort) => ({ type: "offerings", slug: item.slug, sort, data: item })),
  ];
  return { documents, settings: DEFAULT_SETTINGS };
}
