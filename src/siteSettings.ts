/**
 * Live company settings. The admin writes these to D1; `contentStore` applies
 * them in place after the bootstrap fetch, and the page remounts. Mutating the
 * arrays in place matters: page modules capture `phones` by reference.
 */

export type SiteSettings = {
  site: {
    nameEn: string;
    nameKm: string;
    shortName: string;
    founded: number;
    tagline: string;
  };
  contact: {
    phones: string[];
    email: string;
    telegram: string;
    address: string;
    hours: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  features: {
    leadsEnabled: boolean;
    aiAssistEnabled: boolean;
    mediaEnabled: boolean;
  };
};

export const siteSettings: SiteSettings = {
  site: {
    nameEn: "Battambang Construction and Engineering Co., Ltd.",
    nameKm: "ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី",
    shortName: "BCE",
    founded: 1995,
    tagline: "Building Cambodia's foundations since 1995",
  },
  contact: {
    phones: ["012 932 700", "017 222 205", "012 867 475", "070 867 475"],
    email: "bcebtb999@gmail.com",
    telegram: "@thendLP",
    address: "Ang Village, Sangkat O'Char, Battambang City, Battambang Province, Kingdom of Cambodia",
    hours: "Monday – Sunday, 6:30 AM – 5:30 PM",
  },
  seo: {
    title: "BCE — Battambang Construction and Engineering Co., Ltd.",
    description:
      "Ready-mix concrete, piling, civil construction, concrete slab works and fleet hire across 14 Cambodian provinces since 1995.",
    ogImage: "/Image/bce/hero_batching_plant.webp",
  },
  features: {
    leadsEnabled: true,
    aiAssistEnabled: true,
    mediaEnabled: true,
  },
};

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const setMeta = (selector: string, content: string) => {
  if (typeof document === "undefined" || !content) return;
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
};

export const applySiteSettings = (patch: Partial<SiteSettings>) => {
  const contact = patch.contact;
  if (contact) {
    if (Array.isArray(contact.phones) && contact.phones.some(nonEmpty)) {
      siteSettings.contact.phones.length = 0;
      siteSettings.contact.phones.push(...contact.phones.filter(nonEmpty));
    }
    if (nonEmpty(contact.email)) siteSettings.contact.email = contact.email;
    if (nonEmpty(contact.telegram)) siteSettings.contact.telegram = contact.telegram;
    if (nonEmpty(contact.address)) siteSettings.contact.address = contact.address;
    if (nonEmpty(contact.hours)) siteSettings.contact.hours = contact.hours;
  }
  if (patch.site) Object.assign(siteSettings.site, patch.site);
  if (patch.seo) {
    Object.assign(siteSettings.seo, patch.seo);
    setMeta('meta[name="description"]', siteSettings.seo.description);
    setMeta('meta[property="og:description"]', siteSettings.seo.description);
    setMeta('meta[property="og:image"]', siteSettings.seo.ogImage);
  }
  if (patch.features) Object.assign(siteSettings.features, patch.features);
};

export const telegramHandle = () => siteSettings.contact.telegram.replace(/^@/, "");
