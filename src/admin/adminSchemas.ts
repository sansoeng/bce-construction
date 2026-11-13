export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "boolean"
  | "list"
  | "objectList"
  | "group"
  | "json"
  | "image";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  options?: string[];
  fields?: Field[];
  itemFields?: Field[];
  itemLabel?: string;
  required?: boolean;
  rows?: number;
  wide?: boolean;
  /** Frame the image preview at the public site's ratio, e.g. "16 / 9". The whole image is always shown. */
  aspect?: string;
};

/** A titled group of fields, rendered as its own card in the editor. */
export type ContentSection = {
  id: string;
  title: string;
  hint?: string;
  keys: string[];
};

export type ContentSchema = {
  type: string;
  label: string;
  singular: string;
  description: string;
  icon: string;
  titleKey: string;
  slugKey: string;
  fields: Field[];
  /** The editor cards, in order. Fields left out land in a closing "More fields" card. */
  sections: ContentSection[];
  defaults: () => Record<string, unknown>;
  /** Top-level fields that should not appear in the Khmer translation form. */
  skipKm?: string[];
};

const projectCategories = [
  "Ready-Mix Concrete",
  "Piling",
  "Construction",
  "Concrete Slab Works",
  "Truck & Equipment Rental",
];

const valueIcons = [
  "plant",
  "lab",
  "record",
  "truck",
  "rig",
  "blueprint",
  "shield",
  "helmet",
  "rain",
  "layers",
  "grid",
  "wrench",
  "pin",
];

export const SCHEMAS: Record<string, ContentSchema> = {
  projects: {
    type: "projects",
    label: "Projects",
    singular: "Project",
    description: "Portfolio records shown on the Projects page and the home page highlights.",
    icon: "◫",
    titleKey: "name",
    slugKey: "slug",
    defaults: () => ({
      slug: "",
      name: "",
      owner: "",
      location: "",
      period: "",
      category: "Construction",
      summary: "",
      scope: [],
      gallery: [],
      highlights: [],
      equipment: [],
      technical: [],
      outcome: "",
      sample: false,
    }),
    skipKm: ["slug", "category", "sample"],
    sections: [
      { id: "basics", title: "Project details", hint: "Name, reference and the facts shown beside the summary." , keys: ["name", "slug", "category", "owner", "location", "period"] },
      { id: "summary", title: "Summary & scope", hint: "The opening statement and the scope rows on the project page.", keys: ["summary", "scope"] },
      { id: "gallery", title: "Gallery", hint: "The first image is the cover; the rest fill the gallery grid.", keys: ["gallery"] },
      { id: "highlights", title: "Highlights", hint: "The counted figures under “Project highlights”.", keys: ["highlights"] },
      { id: "technical", title: "Equipment & technical details", hint: "The ruled lists in the Details section.", keys: ["equipment", "technical"] },
      { id: "outcome", title: "Outcome", hint: "The closing statement at the end of the page.", keys: ["outcome", "sample"] },
    ],
    fields: [
      { key: "name", label: "Project name", type: "text", required: true, wide: true },
      { key: "slug", label: "URL slug", type: "text", required: true, hint: "Lowercase letters, numbers and hyphens." },
      { key: "category", label: "Category", type: "select", options: projectCategories },
      { key: "owner", label: "Owner / client", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "period", label: "Period", type: "text", placeholder: "Feb 2024 – Sep 2024" },
      { key: "summary", label: "Summary", type: "textarea", rows: 4, wide: true },
      { key: "scope", label: "Scope of work", type: "list", hint: "One line per scope item." },
      { key: "gallery", label: "Gallery", type: "objectList", itemLabel: "Image", itemFields: [
        { key: "image", label: "Image", type: "image", aspect: "4 / 3" },
        { key: "caption", label: "Caption", type: "text" },
      ] },
      { key: "highlights", label: "Highlights", type: "objectList", itemLabel: "Figure", itemFields: [
        { key: "value", label: "Value", type: "text" },
        { key: "unit", label: "Unit", type: "text" },
        { key: "label", label: "Label", type: "text" },
        { key: "note", label: "Note", type: "text" },
      ] },
      { key: "equipment", label: "Equipment used", type: "objectList", itemLabel: "Equipment", itemFields: [
        { key: "name", label: "Name", type: "text" },
        { key: "count", label: "Count", type: "number" },
      ] },
      { key: "technical", label: "Technical details", type: "objectList", itemLabel: "Detail", itemFields: [
        { key: "label", label: "Label", type: "text" },
        { key: "value", label: "Value", type: "text" },
      ] },
      { key: "outcome", label: "Outcome", type: "textarea", rows: 3, wide: true },
      { key: "sample", label: "Sample content", type: "boolean", hint: "Shows the sample tag on the public page." },
    ],
  },

  posts: {
    type: "posts",
    label: "Journal",
    singular: "Article",
    description: "Insights and company news shown on the Journal page.",
    icon: "✎",
    titleKey: "title",
    slugKey: "slug",
    defaults: () => ({
      slug: "",
      title: "",
      category: "Concrete Technology",
      year: String(new Date().getFullYear()),
      date: "",
      readTime: "5 min read",
      image: "",
      alt: "",
      excerpt: "",
      content: { intro: "", sections: [], takeaways: [] },
      author: { name: "", role: "" },
    }),
    skipKm: ["slug", "category", "year", "date", "readTime"],
    sections: [
      { id: "article", title: "Article", hint: "Title, filing and display metadata.", keys: ["title", "slug", "category", "year", "date", "readTime"] },
      { id: "cover", title: "Cover image", hint: "The image and its alternative text.", keys: ["image", "alt"] },
      { id: "body", title: "Body", hint: "Excerpt, author and the structured article body.", keys: ["excerpt", "author", "content"] },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, wide: true },
      { key: "slug", label: "URL slug", type: "text", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "date", label: "Display date", type: "text", placeholder: "15 April 2026" },
      { key: "readTime", label: "Read time", type: "text" },
      { key: "image", label: "Cover image", type: "image", wide: true, aspect: "16 / 9" },
      { key: "alt", label: "Image alt text", type: "text", wide: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", rows: 3, wide: true },
      { key: "author", label: "Author", type: "group", fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
      ] },
      { key: "content", label: "Article body", type: "json", rows: 18, wide: true, hint: "intro, sections[{heading, body[], callout?}], takeaways[]" },
    ],
  },

  vacancies: {
    type: "vacancies",
    label: "Careers",
    singular: "Vacancy",
    description: "Open roles shown on the Careers page.",
    icon: "◆",
    titleKey: "title",
    slugKey: "id",
    defaults: () => ({
      id: "",
      title: "",
      department: "Operations & Batching",
      location: "Battambang Central Plant",
      type: "Full-Time",
      deadline: "",
      overview: "",
      duties: [],
      qualifications: [],
    }),
    skipKm: ["id", "department", "location", "type", "deadline"],
    sections: [
      { id: "role", title: "Role", hint: "Title, reference and the listing metadata.", keys: ["title", "id", "department", "location", "type", "deadline"] },
      { id: "description", title: "Description", hint: "The overview and the two lists on the job page.", keys: ["overview", "duties", "qualifications"] },
    ],
    fields: [
      { key: "title", label: "Role title", type: "text", required: true, wide: true },
      { key: "id", label: "URL id", type: "text", required: true },
      { key: "department", label: "Department", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Full-Time", "Part-Time", "Contract", "Internship"] },
      { key: "deadline", label: "Deadline", type: "text" },
      { key: "overview", label: "Overview", type: "textarea", rows: 4, wide: true },
      { key: "duties", label: "Duties", type: "list" },
      { key: "qualifications", label: "Qualifications", type: "list" },
    ],
  },

  resources: {
    type: "resources",
    label: "Resources",
    singular: "Document",
    description: "Downloadable profiles, brochures, certificates and policies.",
    icon: "⇩",
    titleKey: "title",
    slugKey: "id",
    defaults: () => ({
      id: "",
      title: "",
      category: "technical",
      categoryLabel: "Brochures & Technical Documents",
      description: "",
      fileFormat: "PDF",
      fileSize: "",
      language: "Bilingual (EN / KM)",
      revisionDate: "",
      year: String(new Date().getFullYear()),
      downloadUrl: "",
    }),
    skipKm: ["id", "category", "fileFormat", "fileSize", "language", "revisionDate", "year", "downloadUrl"],
    sections: [
      { id: "document", title: "Document", hint: "Title, category and the summary shown in the list.", keys: ["title", "id", "category", "categoryLabel", "description"] },
      { id: "file", title: "File", hint: "Format, size and the download link.", keys: ["fileFormat", "fileSize", "language", "revisionDate", "year", "downloadUrl"] },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, wide: true },
      { key: "id", label: "URL id", type: "text", required: true },
      { key: "category", label: "Category", type: "select", options: ["profile", "technical", "licenses"] },
      { key: "categoryLabel", label: "Category label", type: "text" },
      { key: "description", label: "Description", type: "textarea", rows: 3, wide: true },
      { key: "fileFormat", label: "Format", type: "text" },
      { key: "fileSize", label: "File size", type: "text" },
      { key: "language", label: "Language", type: "text" },
      { key: "revisionDate", label: "Revision", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "downloadUrl", label: "Download URL", type: "text", wide: true },
    ],
  },

  businesses: {
    type: "businesses",
    label: "Business pages",
    singular: "Business page",
    description: "The five detail pages behind Our Businesses.",
    icon: "▤",
    titleKey: "name",
    slugKey: "slug",
    defaults: () => ({
      slug: "",
      name: "",
      tagline: "",
      heroImage: "",
      heroAlt: "",
      intro: "",
      valuesKicker: "Why BCE",
      valuesTitle: "",
      values: [],
      solutionsKicker: "Our solutions",
      solutionsTitle: "",
      solutionsLead: "",
      solutions: [],
      capacityKicker: "Capacity",
      capacityTitle: "",
      capacityCopy: "",
      figures: [],
      projects: [],
    }),
    skipKm: ["slug", "projects"],
    sections: [
      { id: "identity", title: "Identity", hint: "Name, hero image and the opening statement.", keys: ["name", "slug", "tagline", "heroImage", "heroAlt", "intro"] },
      { id: "values", title: "Why BCE", hint: "The value cards that follow the introduction.", keys: ["valuesKicker", "valuesTitle", "values"] },
      { id: "solutions", title: "Solutions", hint: "The solution list with its photos.", keys: ["solutionsKicker", "solutionsTitle", "solutionsLead", "solutions"] },
      { id: "capacity", title: "Capacity", hint: "The figures shown beneath the solutions.", keys: ["capacityKicker", "capacityTitle", "capacityCopy", "figures"] },
      { id: "projects", title: "Related projects", hint: "Project slugs cross-sold at the end of the page.", keys: ["projects"] },
    ],
    fields: [
      { key: "name", label: "Business name", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text", required: true },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "heroImage", label: "Hero image", type: "image", wide: true, aspect: "16 / 9" },
      { key: "heroAlt", label: "Hero alt text", type: "text", wide: true },
      { key: "intro", label: "Introduction", type: "textarea", rows: 4, wide: true },
      { key: "valuesKicker", label: "Values kicker", type: "text" },
      { key: "valuesTitle", label: "Values title", type: "text" },
      { key: "values", label: "Why BCE", type: "objectList", itemLabel: "Value", itemFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "icon", label: "Icon", type: "select", options: valueIcons },
        { key: "text", label: "Text", type: "textarea", rows: 3 },
      ] },
      { key: "solutionsKicker", label: "Solutions kicker", type: "text" },
      { key: "solutionsTitle", label: "Solutions title", type: "text" },
      { key: "solutionsLead", label: "Solutions lead", type: "textarea", rows: 3, wide: true },
      { key: "solutions", label: "Solutions", type: "objectList", itemLabel: "Solution", itemFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea", rows: 3 },
        { key: "image", label: "Image", type: "image", aspect: "4 / 3" },
        { key: "alt", label: "Alt text", type: "text" },
      ] },
      { key: "capacityKicker", label: "Capacity kicker", type: "text" },
      { key: "capacityTitle", label: "Capacity title", type: "text" },
      { key: "capacityCopy", label: "Capacity copy", type: "textarea", rows: 3, wide: true },
      { key: "figures", label: "Capacity figures", type: "objectList", itemLabel: "Figure", itemFields: [
        { key: "value", label: "Value", type: "text" },
        { key: "label", label: "Label", type: "text" },
      ] },
      { key: "projects", label: "Related project slugs", type: "list" },
    ],
  },

  offerings: {
    type: "offerings",
    label: "Home services",
    singular: "Service card",
    description: "The five service cards used on the home page, footer and quote form.",
    icon: "▦",
    titleKey: "name",
    slugKey: "slug",
    defaults: () => ({
      slug: "",
      name: "",
      tagline: "",
      intro: "",
      image: "",
      bg: "#293e8a",
      fg: "#fff",
      details: [],
    }),
    skipKm: ["slug", "bg", "fg"],
    sections: [
      { id: "card", title: "Service card", hint: "The card's name, copy, photo and colours.", keys: ["name", "slug", "tagline", "intro", "image", "bg", "fg"] },
      { id: "facts", title: "Key facts", hint: "The bullet rows shown on the card.", keys: ["details"] },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text", required: true },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "intro", label: "Introduction", type: "textarea", rows: 3, wide: true },
      { key: "image", label: "Image", type: "image", wide: true, aspect: "4 / 3" },
      { key: "bg", label: "Background colour", type: "text" },
      { key: "fg", label: "Text colour", type: "text" },
      { key: "details", label: "Key facts", type: "list" },
    ],
  },

  pages: {
    type: "pages",
    label: "Custom pages",
    singular: "Custom page",
    description: "Optional JSON-backed pages for campaigns, notices and landing pages.",
    icon: "◧",
    titleKey: "title",
    slugKey: "slug",
    defaults: () => ({ slug: "", title: "", data: {} }),
    skipKm: ["slug"],
    sections: [
      { id: "page", title: "Page", keys: ["title", "slug", "data"] },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, wide: true },
      { key: "slug", label: "URL slug", type: "text", required: true },
      { key: "data", label: "Page data", type: "json", rows: 16, wide: true },
    ],
  },
};

export const contentTypes = Object.keys(SCHEMAS);

export const slugifyTitle = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const getField = (schema: ContentSchema, key: string) => schema.fields.find((field) => field.key === key);

export const readValue = (data: Record<string, unknown>, key: string) => data?.[key];

export const writeValue = (data: Record<string, unknown>, key: string, value: unknown) => ({
  ...data,
  [key]: value,
});
