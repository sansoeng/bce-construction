import { mergeDefaults, registerContentType } from "./contentStore";

// Clients, partners and key suppliers (/partners).
//
// The register is transcribed from BCE's Corporate Profile 2026, "Clients & Partners" (pages 34–35), so the page and
// the printed profile cannot disagree. The profile numbers the contractor list 1–16 then 18–37 (there is no 17 in the
// source); the order here follows the profile without inventing an entry.
//
// This is the single source of truth for partner artwork: the homepage "at a glance" section reads the featured items
// from here, so a logo is only ever uploaded once.

export type Partner = {
  name: string;
  /** Approve artwork only; a partner without a file keeps the wordmark treatment. */
  logo?: string;
  /** Shown in the homepage "Trusted partners & clients" grid. */
  featured?: boolean;
};

export type PartnerGroup = {
  id: string;
  label: string;
  /** The compact label used by the two-column homepage grid. */
  shortLabel: string;
  note: string;
  items: Partner[];
};

export type PartnersContent = {
  /** Admin document title; the page reads the cover fields below. */
  title: string;
  slug: string;
  kicker: string;
  titleLines: string[];
  intro: string;
  registerNote: string;
  footnote: string;
  groups: PartnerGroup[];
};

const LOGO = {
  obayashi: "/assets/partners/obayashi.svg",
  hanshin: "/assets/partners/hanshin.jpg",
  sumec: "/assets/partners/sumec.webp",
  schneitec: "/assets/partners/schneitec.png",
  bbu: "/assets/partners/build-bright-university.png",
  mpwt: "/assets/partners/mpwt.png",
  mlmupc: "/assets/partners/mlmupc.png",
  mowram: "/assets/partners/mowram.png",
  mrd: "/assets/partners/mrd.png",
  moc: "/assets/partners/moc.png",
  chipMong: "/assets/partners/chip-mong-group.png",
  scg: "/assets/partners/scg.png",
  sika: "/assets/partners/sika.png",
  conch: "/assets/partners/conch.jpg",
} as const;

export const DEFAULT_PARTNERS: PartnersContent = {
  title: "Clients & partners",
  slug: "home",
  kicker: "Clients & partners",
  titleLines: ["Strong relationships.", "Shared success."],
  intro:
    "BCE has built long-term working relationships across Cambodia’s public and private sectors. Our network includes government and public institutions, contractors, development and strategic partners, corporate clients, and key suppliers who contribute to the successful delivery of our projects and services.",
  registerNote: "The full register, as published in BCE’s Corporate Profile 2026.",
  footnote:
    "Organisations and individuals listed as published in the BCE Corporate Profile 2026. Names and marks belong to their respective owners.",
  groups: [
    {
      id: "government",
      label: "Government & public sector",
      shortLabel: "Government & public sector",
      note: "Public institutions · Authorities · Government projects",
      items: [
        { name: "Ministry of Water Resources and Meteorology", logo: LOGO.mowram, featured: true },
        { name: "Ministry of Land Management, Urban Planning and Construction", logo: LOGO.mlmupc, featured: true },
        { name: "Ministry of Commerce", logo: LOGO.moc, featured: true },
        { name: "Ministry of Mines and Energy" },
        { name: "Ministry of Public Works and Transport", logo: LOGO.mpwt, featured: true },
        { name: "Ministry of Labour and Vocational Training" },
        { name: "Ministry of Industry, Science, Technology & Innovation" },
        { name: "Ministry of Rural Development", logo: LOGO.mrd, featured: true },
        { name: "Ministry of Economy and Finance" },
        { name: "Ministry of Interior" },
        { name: "General Department of Tax" },
        { name: "National Social Security Fund (NSSF)" },
        { name: "Building and Public Works Laboratory" },
        { name: "Ministry of National Defence" },
        { name: "Provincial Halls in Provinces Where BCE Operates", featured: true },
        { name: "Provincial Administrations in BCE’s Operational Areas" },
      ],
    },
    {
      id: "clients",
      label: "Contractors, partners & corporate clients",
      shortLabel: "Clients",
      note: "Contractors · Development & strategic partners · Corporate clients",
      items: [
        { name: "EM Construction Import Export Co., Ltd." },
        { name: "Branch of Thang Long Joint Stock Corporation – JSC", featured: true },
        { name: "Ilsung & Cienco" },
        { name: "Hanshin Engineering & Construction Co., Ltd.", logo: LOGO.hanshin, featured: true },
        { name: "Obayashi", logo: LOGO.obayashi, featured: true },
        { name: "EDCCF" },
        { name: "Bahai" },
        { name: "Build Bright University (BBU)", logo: LOGO.bbu, featured: true },
        { name: "Taing Chheng Oing Construction & Import Export Co., Ltd. (TCO)" },
        { name: "SUMEC International Technology Co., Ltd.", logo: LOGO.sumec, featured: true },
        { name: "The Seaboard Cambodian Development Construction" },
        { name: "Borey Ratanak" },
        { name: "UOFN Battambang (YWAM)" },
        { name: "Schneitec Co., Ltd.", logo: LOGO.schneitec, featured: true },
        { name: "T.S.K Construction Co., Ltd." },
        { name: "ZOA" },
        { name: "S.N.K.R.P Co., Ltd." },
        { name: "Punloeu Banyeay Srey Construction Co., Ltd." },
        { name: "Samdech Pichey Sena Tea Banh" },
        { name: "H.E. Pronh Ritha" },
        { name: "H.E. In Viracheat" },
        { name: "H.E. Tum Helhangry" },
        { name: "H.E. Sok Sokhon" },
        { name: "H.E. Khiev Satya" },
        { name: "Lok Oknha Vong Duong" },
        { name: "Dr. Yi Kuok" },
        { name: "Dr. Sok Vannara" },
        { name: "Mr. Sy Rattanak" },
        { name: "Mr. So Reaksmey" },
        { name: "Mr. Songfu" },
        { name: "Mrs. Soun Thouk" },
        { name: "Mr. Song Chamnan" },
        { name: "Mrs. Thouen Sophea" },
        { name: "Mr. Phum Sopheak" },
        { name: "Mr. Luo Jianbo" },
        { name: "Mr. Kim Tieng" },
      ],
    },
    {
      id: "suppliers",
      label: "Key suppliers",
      shortLabel: "Suppliers & technical partners",
      note: "Materials · Equipment · Operational support",
      items: [
        { name: "Ly Kea" },
        { name: "Chip Mong Group Co., Ltd.", logo: LOGO.chipMong, featured: true },
        { name: "Dynamic Engineering Steel" },
        { name: "Hour Huy Leng" },
        { name: "Almond Company" },
        { name: "Veng Srun" },
        { name: "Ye Yaqing" },
        { name: "Cambodia Cement Chakrey Ting Factory Co., Ltd." },
        { name: "Hong Huot Ly Co., Ltd.", featured: true },
        { name: "Battambang Conch Cement Co. Ltd.", logo: LOGO.conch, featured: true },
        { name: "SCG Distribution and Retail Co., Ltd.", logo: LOGO.scg, featured: true },
        { name: "Rong Sheng Jilong Chemicals Co., Ltd." },
        { name: "Sika Cambodia", logo: LOGO.sika, featured: true },
        { name: "Leng Seng Na" },
        { name: "Mitapheap" },
      ],
    },
  ],
};

/**
 * Approved artwork by name. D1 stores the partner groups as a whole array, so a document saved before a logo existed
 * (or an older row using the short names) would otherwise hide it. The Khmer names are included because the overlay
 * translates the government list before the applier runs.
 */
const PARTNER_LOGOS: Record<string, string> = {
  "Ministry of Water Resources and Meteorology": LOGO.mowram,
  "Ministry of Land Management, Urban Planning and Construction": LOGO.mlmupc,
  "Ministry of Commerce": LOGO.moc,
  "Ministry of Public Works and Transport": LOGO.mpwt,
  "Ministry of Rural Development": LOGO.mrd,
  "ក្រសួងធនធានទឹក និងឧតុនិយម": LOGO.mowram,
  "ក្រសួងរៀបចំដែនដី នគរូបនីយកម្ម និងសំណង់": LOGO.mlmupc,
  "ក្រសួងពាណិជ្ជកម្ម": LOGO.moc,
  "ក្រសួងសាធារណការ និងដឹកជញ្ជូន": LOGO.mpwt,
  "ក្រសួងអភិវឌ្ឍន៍ជនបទ": LOGO.mrd,
  "Hanshin Engineering & Construction Co., Ltd.": LOGO.hanshin,
  "Hanshin Engineering & Construction": LOGO.hanshin,
  "Hanshin E&C": LOGO.hanshin,
  Obayashi: LOGO.obayashi,
  "Build Bright University (BBU)": LOGO.bbu,
  "Build Bright University": LOGO.bbu,
  "SUMEC International Technology Co., Ltd.": LOGO.sumec,
  "SUMEC International Technology": LOGO.sumec,
  SUMEC: LOGO.sumec,
  "Schneitec Co., Ltd.": LOGO.schneitec,
  SchneiTec: LOGO.schneitec,
  "Chip Mong Group Co., Ltd.": LOGO.chipMong,
  "Chip Mong Group": LOGO.chipMong,
  "Battambang Conch Cement Co. Ltd.": LOGO.conch,
  "Battambang Conch Cement": LOGO.conch,
  "SCG Distribution and Retail Co., Ltd.": LOGO.scg,
  "SCG Distribution and Retail": LOGO.scg,
  SCG: LOGO.scg,
  "Sika Cambodia": LOGO.sika,
};

const applyPartnerLogos = (groups: PartnerGroup[]) => {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.logo?.includes("/assets/partners/placeholder-")) delete item.logo;
      const approved = PARTNER_LOGOS[item.name];
      if (approved && !item.logo) item.logo = approved;
    }
  }
};

applyPartnerLogos(DEFAULT_PARTNERS.groups);

/** Live content. Read these values during render; the object is replaced on bootstrap. */
export const partners: PartnersContent = JSON.parse(JSON.stringify(DEFAULT_PARTNERS)) as PartnersContent;

registerContentType("partners", (items) => {
  const first = items[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return;
  const merged = mergeDefaults(DEFAULT_PARTNERS, first);
  applyPartnerLogos(merged.groups);
  Object.assign(partners, merged);
}, DEFAULT_PARTNERS);

export const partnerCount = (content: PartnersContent = partners) =>
  content.groups.reduce((total, group) => total + group.items.length, 0);

/**
 * The homepage grid order: clients first (full width), then government and suppliers side by side, matching the
 * original section. Only featured items are shown; the full register lives on /partners.
 */
export const featuredGroups = (content: PartnersContent = partners) => {
  const order = ["clients", "government", "suppliers"];
  return order
    .map((id) => content.groups.find((group) => group.id === id))
    .filter((group): group is PartnerGroup => Boolean(group))
    .map((group) => ({
      label: group.shortLabel,
      // Logos first, then the wordmarks: the home page wall should lead with artwork.
      items: group.items
        .filter((item) => item.featured)
        .sort((a, b) => Number(Boolean(b.logo)) - Number(Boolean(a.logo))),
    }))
    .filter((group) => group.items.length > 0);
};
