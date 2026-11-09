// English / Khmer. The site is written in English; in Khmer mode a translator pass swaps every English text node,
// alt and aria-label that has an entry below (exact phrase, then the patterns for templated strings), before the text
// reveals split the copy, and a MutationObserver keeps text React changes later (filters, viewer captions) in Khmer.
// Khmer text renders in Noto Serif Khmer (Google Fonts, Khmer range only), so English and numbers stay in Aeonik.
//
// The Khmer copy is a first translation: have a native speaker review it, especially the sample project content.

export type Lang = "en" | "km";
const KEY = "bce-lang";

let lang: Lang = (() => {
  try { return localStorage.getItem(KEY) === "km" ? "km" : "en"; } catch { return "en"; }
})();
document.documentElement.lang = lang === "km" ? "km" : "en";

const listeners = new Set<() => void>();
export const getLang = () => lang;
export const onLangChange = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};
export function setLang(next: Lang) {
  if (next === lang) return;
  lang = next;
  try { localStorage.setItem(KEY, next); } catch { /* not persisted in private mode */ }
  document.documentElement.lang = next === "km" ? "km" : "en";
  listeners.forEach((fn) => fn());
}

const MONTHS: Record<string, string> = {
  Jan: "មករា", Feb: "កុម្ភៈ", Mar: "មីនា", Apr: "មេសា", May: "ឧសភា", Jun: "មិថុនា",
  Jul: "កក្កដា", Aug: "សីហា", Sep: "កញ្ញា", Oct: "តុលា", Nov: "វិច្ឆិកា", Dec: "ធ្នូ",
};

const KM: Record<string, string> = {
  // Navigation, header, menu
  "Home": "ទំព័រដើម", "About": "អំពីយើង", "Expertise": "ជំនាញ", "Projects": "គម្រោង", "Coverage": "តំបន់សេវាកម្ម",
  "Contact": "ទំនាក់ទំនង", "Menu": "ម៉ឺនុយ", "Main": "ម៉ឺនុយមេ", "Close menu": "បិទម៉ឺនុយ", "Get a quote": "ស្នើសុំតម្លៃ",
  "Call": "ហៅទូរសព្ទ", "BCE Construction, home": "BCE Construction ទំព័រដើម", "BCE Construction, back to top": "BCE Construction ត្រឡប់ទៅលើ",
  "Battambang, KH": "បាត់ដំបង កម្ពុជា", "Footer": "បាតកថា", "Back to top": "ត្រឡប់ទៅលើ", "Get directions": "មើលផ្លូវ",
  "Project": "គម្រោង", "View": "មើល", "Details": "ព័ត៌មានលម្អិត", "Highlights": "ចំណុចសំខាន់ៗ", "Outcome": "លទ្ធផល",
  "Resources": "ធនធាន", "Next project": "គម្រោងបន្ទាប់", "Request a quotation": "ស្នើសុំសម្រង់តម្លៃ",
  // Loader
  "Construction company": "ក្រុមហ៊ុនសំណង់", "Infrastructure & building": "ហេដ្ឋារចនាសម្ព័ន្ធ និងអគារ",
  "Cambodia": "កម្ពុជា", "Loading": "កំពុងផ្ទុក",
  // Hero, about
  "Building on Strength.": "កសាងលើភាពរឹងមាំ", "Delivering with Trust.": "ផ្ដល់ជូនដោយទំនុកចិត្ត",
  "Building on Strength. Delivering with Trust.": "កសាងលើភាពរឹងមាំ។ ផ្ដល់ជូនដោយទំនុកចិត្ត",
  "[Scroll down]": "[រំកិលចុះក្រោម]", "Batching plant": "រោងចក្រលាយបេតុង", "BCE architectural detail": "ព័ត៌មានលម្អិតស្ថាបត្យកម្ម BCE",
  "We supply ready-mix concrete, reinforced concrete piling and civil construction for infrastructure, industrial, commercial and residential projects nationwide.":
    "យើងផ្គត់ផ្គង់បេតុងលាយស្រេច ការបោះសសរស្ដម្ភបេតុងអារម៉េ និងសំណង់ស៊ីវិល សម្រាប់គម្រោងហេដ្ឋារចនាសម្ព័ន្ធ ឧស្សាហកម្ម ពាណិជ្ជកម្ម និងលំនៅដ្ឋាន ទូទាំងប្រទេស",
  "BCE is a Battambang-based": "BCE ជាក្រុមហ៊ុនវិស្វកម្ម និងសំណង់",
  "engineering and construction company, building across Cambodia since 1995 with modern equipment and a skilled team.":
    "មានមូលដ្ឋាននៅខេត្តបាត់ដំបង ដែលបានសាងសង់ទូទាំងកម្ពុជាចាប់តាំងពីឆ្នាំ ១៩៩៥ ជាមួយគ្រឿងចក្រទំនើប និងក្រុមការងារជំនាញ",
  "BCE is a Battambang-based engineering and construction company, building across Cambodia since 1995 with modern equipment and a skilled team.":
    "BCE ជាក្រុមហ៊ុនវិស្វកម្ម និងសំណង់ មានមូលដ្ឋាននៅខេត្តបាត់ដំបង ដែលបានសាងសង់ទូទាំងកម្ពុជាចាប់តាំងពីឆ្នាំ ១៩៩៥ ជាមួយគ្រឿងចក្រទំនើប និងក្រុមការងារជំនាញ",
  // Core business
  "Core business": "អាជីវកម្មស្នូល", "Our core": "អាជីវកម្ម", "business offering": "ស្នូលរបស់យើង", "Our core business offering": "អាជីវកម្មស្នូលរបស់យើង",
  "Concrete supply, piling, construction, slab works and equipment rental under one roof.":
    "ការផ្គត់ផ្គង់បេតុង ការបោះសសរស្ដម្ភ សំណង់ ការងារចាក់កម្រាលបេតុង និងការជួលគ្រឿងចក្រ នៅកន្លែងតែមួយ",
  "Scroll to explore": "រំកិលដើម្បីស្វែងរក",
  "Ready-Mix Concrete": "បេតុងលាយស្រេច", "Piling": "ការបោះសសរស្ដម្ភ", "Construction": "សំណង់",
  "Concrete Slab Works": "ការងារចាក់កម្រាលបេតុង", "Truck & Equipment Rental": "ការជួលឡាន និងគ្រឿងចក្រ",
  "4 batching plants": "រោងចក្រលាយបេតុង ៤", "70 m³/hr per plant": "៧០ m³/ម៉ោង ក្នុងមួយរោងចក្រ", "41 mixer trucks": "ឡានលាយបេតុង ៤១ គ្រឿង",
  "Slump and strength testing": "តេស្ដស្រុត និងកម្លាំងបេតុង", "Reinforced concrete piles": "សសរស្ដម្ភបេតុងអារម៉េ",
  "Our own piling rigs": "ម៉ាស៊ីនបោះសសរស្ដម្ភផ្ទាល់ខ្លួន", "Infrastructure and buildings": "ហេដ្ឋារចនាសម្ព័ន្ធ និងអគារ",
  "Laboratory quality control": "ការត្រួតពិនិត្យគុណភាពក្នុងមន្ទីរពិសោធន៍", "Infrastructure": "ហេដ្ឋារចនាសម្ព័ន្ធ",
  "Industrial": "ឧស្សាហកម្ម", "Commercial": "ពាណិជ្ជកម្ម", "Residential": "លំនៅដ្ឋាន", "8 pump trucks": "ឡានបូមបេតុង ៨ គ្រឿង",
  "Ready-mix from our plants": "បេតុងលាយស្រេចពីរោងចក្ររបស់យើង", "Delivered on spec": "ដឹកជញ្ជូនតាមលក្ខណៈបច្ចេកទេស",
  "Mixer trucks": "ឡានលាយបេតុង", "Pump trucks": "ឡានបូមបេតុង", "Piling rigs": "ម៉ាស៊ីនបោះសសរស្ដម្ភ", "Maintained and ready": "ថែទាំល្អ និងត្រៀមរួចជាស្រេច",
  // At a glance, partners
  "BCE at a glance": "ទិដ្ឋភាពទូទៅរបស់ BCE", "Years of experience": "ឆ្នាំនៃបទពិសោធន៍", "Established 1995": "បង្កើតឡើងឆ្នាំ ១៩៩៥",
  "Batching plants": "រោងចក្រលាយបេតុង", "70 m³/hr each": "៧០ m³/ម៉ោង ក្នុងមួយរោងចក្រ", "Projects completed": "គម្រោងបានបញ្ចប់",
  "In 2025": "ក្នុងឆ្នាំ ២០២៥", "Clients served": "អតិថិជនដែលបានបម្រើ", "Plus 8 pump trucks": "បូកឡានបូមបេតុង ៨ គ្រឿង",
  "Provinces served": "ខេត្តដែលបានបម្រើ", "13 provinces + Phnom Penh": "១៣ ខេត្ត និងរាជធានីភ្នំពេញ",
  "Trusted partners & clients": "ដៃគូ និងអតិថិជនដែលទុកចិត្ត",
  // HSE
  "HSE & Operational Commitments": "ការប្ដេជ្ញាចិត្តលើសុខភាព សុវត្ថិភាព បរិស្ថាន និងប្រតិបត្តិការ",
  "BCE HSE and operational commitments": "ការប្ដេជ្ញាចិត្តរបស់ BCE លើសុខភាព សុវត្ថិភាព បរិស្ថាន និងប្រតិបត្តិការ",
  "Protecting": "ការពារ", "people": "មនុស្ស", "Working": "ធ្វើការ", "safely": "ដោយសុវត្ថិភាព", "Respecting": "គោរព",
  "the environment": "បរិស្ថាន", "Delivering": "ផ្ដល់", "quality": "គុណភាព", "Building": "កសាង", "trust": "ទំនុកចិត្ត",
  "We protect our people, our partners and the communities around every project we undertake.":
    "យើងការពារបុគ្គលិក ដៃគូ និងសហគមន៍នៅជុំវិញគ្រប់គម្រោងដែលយើងអនុវត្ត",
  "Safe operations and a well-maintained fleet, run by a skilled and experienced team.":
    "ប្រតិបត្តិការប្រកបដោយសុវត្ថិភាព និងគ្រឿងចក្រដែលថែទាំល្អ ដំណើរការដោយក្រុមការងារជំនាញ និងមានបទពិសោធន៍",
  "We build today while protecting resources for future generations, through environmental responsibility and resource efficiency.":
    "យើងសាងសង់សម្រាប់ថ្ងៃនេះ ខណៈពេលការពារធនធានសម្រាប់មនុស្សជំនាន់ក្រោយ តាមរយៈការទទួលខុសត្រូវចំពោះបរិស្ថាន និងការប្រើប្រាស់ធនធានប្រកបដោយប្រសិទ្ធភាព",
  "Built to last. From certified batching to precision placement, laboratory quality control ensures every structure remains strong, durable and enduring.":
    "សាងសង់ឱ្យមានភាពយូរអង្វែង។ ចាប់ពីការលាយបេតុងដែលមានវិញ្ញាបនបត្រ រហូតដល់ការចាក់ប្រកបដោយភាពជាក់លាក់ ការត្រួតពិនិត្យគុណភាពក្នុងមន្ទីរពិសោធន៍ធានាថារាល់សំណង់មានភាពរឹងមាំ និងប្រើប្រាស់បានយូរ",
  "Stronger together. We grow alongside our clients, partners and suppliers through long-term relationships built on trust, respect and mutual success.":
    "រួមគ្នាកាន់តែរឹងមាំ។ យើងរីកចម្រើនជាមួយអតិថិជន ដៃគូ និងអ្នកផ្គត់ផ្គង់ តាមរយៈទំនាក់ទំនងរយៈពេលវែង ដែលផ្អែកលើទំនុកចិត្ត ការគោរព និងភាពជោគជ័យរួមគ្នា",
  // Selected projects, coverage
  "Selected": "គម្រោង", "See all projects": "មើលគម្រោងទាំងអស់",
  "Where we work in Cambodia.": "តំបន់ដែលយើងធ្វើការនៅកម្ពុជា",
  "Where we work": "តំបន់ដែលយើងធ្វើការ", "in Cambodia.": "នៅកម្ពុជា",
  "We go where you build. With strong equipment capacity, experienced teams and reliable coordination, we support projects across 13 provinces and Phnom Penh.":
    "យើងទៅដល់គ្រប់ទីកន្លែងដែលអ្នកសាងសង់។ ជាមួយសមត្ថភាពគ្រឿងចក្រខ្លាំង ក្រុមការងារមានបទពិសោធន៍ និងការសម្របសម្រួលដែលអាចទុកចិត្តបាន យើងគាំទ្រគម្រោងនៅទូទាំង ១៣ ខេត្ត និងរាជធានីភ្នំពេញ",
  "Operational coverage": "តំបន់ប្រតិបត្តិការ", "Choose a location": "ជ្រើសរើសទីតាំង", "Head Office": "ការិយាល័យកណ្ដាល",
  "Head office": "ការិយាល័យកណ្ដាល", "Ready": "ត្រៀមរួច", "Available for deployment": "ត្រៀមខ្លួនដាក់ពង្រាយ",
  "Drag map to move": "អូសផែនទីដើម្បីផ្លាស់ទី", "Map zoom controls": "ប៊ូតុងពង្រីកផែនទី", "Zoom in": "ពង្រីក",
  "Zoom out": "បង្រួម", "Reset map view": "កំណត់ផែនទីឡើងវិញ",
  "Map of Cambodia showing completed projects across 13 provinces and Phnom Penh where BCE operates":
    "ផែនទីកម្ពុជាបង្ហាញគម្រោងដែលបានបញ្ចប់នៅទូទាំង ១៣ ខេត្ត និងរាជធានីភ្នំពេញ ដែល BCE ប្រតិបត្តិការ",
  "Boundaries © OpenStreetMap contributors · Completed projects across Cambodia": "ព្រំដែន © អ្នករួមចំណែក OpenStreetMap · គម្រោងដែលបានបញ្ចប់ទូទាំងកម្ពុជា",
  "Tonle Sap": "តំបន់ទន្លេសាប", "Plateau & Mountain": "តំបន់ខ្ពង់រាប និងភ្នំ", "Plains": "តំបន់វាលទំនាប", "Coastal": "តំបន់ឆ្នេរ",
  "Banteay Meanchey": "បន្ទាយមានជ័យ", "Battambang": "បាត់ដំបង", "Kampong Cham": "កំពង់ចាម", "Kampong Chhnang": "កំពង់ឆ្នាំង",
  "Kampong Speu": "កំពង់ស្ពឺ", "Kampong Thom": "កំពង់ធំ", "Kampot": "កំពត", "Kandal": "កណ្ដាល", "Kep": "កែប", "Koh Kong": "កោះកុង",
  "Kratie": "ក្រចេះ", "Mondulkiri": "មណ្ឌលគិរី", "Oddar Meanchey": "ឧត្ដរមានជ័យ", "Pailin": "ប៉ៃលិន", "Phnom Penh": "ភ្នំពេញ",
  "Preah Sihanouk": "ព្រះសីហនុ", "Preah Vihear": "ព្រះវិហារ", "Prey Veng": "ព្រៃវែង", "Pursat": "ពោធិ៍សាត់", "Ratanakiri": "រតនគិរី",
  "Siem Reap": "សៀមរាប", "Stung Treng": "ស្ទឹងត្រែង", "Svay Rieng": "ស្វាយរៀង", "Takeo": "តាកែវ", "Tbong Khmum": "ត្បូងឃ្មុំ",
  "Concrete pumping": "ការបូមបេតុង", "Locations covered": "ទីតាំងដែលយើងគ្របដណ្ដប់", "Equipment based here": "គ្រឿងចក្រប្រចាំនៅទីនេះ",
  "Mobilised from Battambang on request": "ដាក់ពង្រាយពីបាត់ដំបងតាមការស្នើសុំ", "Mixer truck": "ឡានលាយបេតុង", "Piling rig": "ម៉ាស៊ីនបោះសសរស្ដម្ភ",
  "Mobilization ready": "ត្រៀមដាក់ពង្រាយ", "Locations covered across Cambodia": "ទីតាំងដែលយើងគ្របដណ្ដប់ទូទាំងកម្ពុជា",
  "13 provinces + Phnom Penh, all served from one base.": "១៣ ខេត្ត និងរាជធានីភ្នំពេញ ដែលបម្រើពីមូលដ្ឋានតែមួយ",
  "Projects completed from Battambang": "គម្រោងដែលបានបញ្ចប់ពីបាត់ដំបង",
  "Our plants, fleet and crews start here and mobilise anywhere in the country.": "រោងចក្រ យានយន្ត និងក្រុមការងាររបស់យើងចេញដំណើរពីទីនេះ ហើយដាក់ពង្រាយគ្រប់ទីកន្លែងក្នុងប្រទេស",
  "Explore the map": "ស្វែងរកលើផែនទី",
  "Select a province to see its projects and the equipment based there.": "ជ្រើសរើសខេត្តមួយ ដើម្បីមើលគម្រោង និងគ្រឿងចក្រដែលប្រចាំនៅទីនោះ",
  "Close": "បិទ", "About BCE": "អំពី BCE", "Company overview": "ទិដ្ឋភាពទូទៅនៃក្រុមហ៊ុន", "BCE in numbers": "BCE ជាតួលេខ", "Chairwoman’s message": "សារពីប្រធានក្រុមប្រឹក្សា", "Our history": "ប្រវត្តិរបស់យើង", "Corporate milestones": "ព្រឹត្តិការណ៍សំខាន់ៗ", "Vision, mission & core values": "ចក្ខុវិស័យ បេសកកម្ម និងគុណតម្លៃស្នូល", "Vision": "ចក្ខុវិស័យ", "Mission": "បេសកកម្ម", "Core values": "គុណតម្លៃស្នូល", "Leadership": "ថ្នាក់ដឹកនាំ", "Licences & certifications": "អាជ្ញាប័ណ្ណ និងវិញ្ញាបនបត្រ", "Request company profile": "ស្នើសុំប្រវត្តិក្រុមហ៊ុន", "Request documents": "ស្នើសុំឯកសារ", "View the coverage map": "មើលផែនទីតំបន់គ្របដណ្ដប់", "On request": "តាមការស្នើសុំ", "Headquarters": "ទីស្នាក់ការកណ្ដាល", "Established": "បង្កើតឡើង", "Business areas": "វិស័យអាជីវកម្ម", "Team": "ក្រុមការងារ", "Employees": "បុគ្គលិក", "Engineers": "វិស្វករ", "Chairwoman": "ប្រធានក្រុមប្រឹក្សា", "Since 1995": "តាំងពីឆ្នាំ ១៩៩៥",
  "BCE is a Battambang-based construction, concrete, piling and engineering company.": "BCE ជាក្រុមហ៊ុនសំណង់ បេតុង ការបោះសសរស្ដម្ភ និងវិស្វកម្ម ដែលមានមូលដ្ឋាននៅខេត្តបាត់ដំបង",
  "With our own batching plants, mixer trucks, pump trucks and piling rigs, and a team of 71 including 15 engineers, we keep every project on schedule and on spec.":
    "ជាមួយរោងចក្រលាយបេតុង រថយន្តលាយបេតុង រថយន្តបូមបេតុង និងម៉ាស៊ីនបោះសសរស្ដម្ភផ្ទាល់ខ្លួន និងក្រុមការងារ ៧១ នាក់ រួមទាំងវិស្វករ ១៥ នាក់ យើងធានាថារាល់គម្រោងដំណើរការទាន់ពេលវេលា និងត្រឹមត្រូវតាមលក្ខណៈបច្ចេកទេស",
  "Engineering and construction, from Battambang across Cambodia since 1995": "វិស្វកម្ម និងសំណង់ ពីបាត់ដំបង ទូទាំងកម្ពុជា តាំងពីឆ្នាំ ១៩៩៥",
  "Concrete, piling, construction and fleet, all under one roof": "បេតុង ការបោះសសរស្ដម្ភ សំណង់ និងយានយន្ត ទាំងអស់នៅកន្លែងតែមួយ",
  "Concrete production and logistics": "ការផលិត និងដឹកជញ្ជូនបេតុង", "Who we are": "យើងជានរណា",
  "Everywhere You Build,": "គ្រប់ទីកន្លែងដែលអ្នកសាងសង់",
  "We’ve Got You Covered.": "យើងនៅទីនោះជាមួយអ្នក",
  "Equipment fleet": "កងយានយន្ត និងគ្រឿងចក្រ",
  "Machines in our own fleet": "គ្រឿងចក្ររបស់យើងផ្ទាល់",
  "Plus our own piling rigs.": "បូករួមទាំងម៉ាស៊ីនបុកគ្រឹះរបស់យើងផ្ទាល់",
  "Click on a province to see more details": "ចុចលើខេត្តមួយ ដើម្បីមើលព័ត៌មានលម្អិត",
  "Completed projects": "គម្រោងដែលបានបញ្ចប់",
  "Projects completed across Cambodia": "គម្រោងដែលបានបញ្ចប់ទូទាំងកម្ពុជា",
  "Delivered province by province, from Pailin to Stung Treng.": "ប្រគល់ជូនពីខេត្តមួយទៅខេត្តមួយ ចាប់ពីប៉ៃលិនដល់ស្ទឹងត្រែង",
  "Slab works": "ការងារកម្រាល",
  // Why BCE, quotation, footer
  "Why choose BCE": "ហេតុអ្វីជ្រើសរើស BCE", "Quality": "គុណភាព", "Capacity": "សមត្ថភាព", "Trust": "ទំនុកចិត្ត",
  "Tested at every stage": "ត្រួតពិនិត្យគ្រប់ដំណាក់កាល", "Our own plants and fleet": "រោងចក្រ និងគ្រឿងចក្រផ្ទាល់ខ្លួន",
  "Partners for the long term": "ដៃគូរយៈពេលវែង",
  "Planning a project? Request a quotation.": "កំពុងរៀបចំគម្រោង? ស្នើសុំសម្រង់តម្លៃ",
  "Tell us your site, scope and schedule, whether it is ready-mix concrete, piling, construction, slab works or equipment rental. Our engineers will review it and come back with a clear, detailed quotation, supplied from our own plants and fleet across Cambodia.":
    "ប្រាប់យើងអំពីទីតាំង វិសាលភាពការងារ និងកាលវិភាគរបស់អ្នក មិនថាជាបេតុងលាយស្រេច ការបោះសសរស្ដម្ភ សំណង់ ការងារចាក់កម្រាល ឬការជួលគ្រឿងចក្រ។ វិស្វកររបស់យើងនឹងពិនិត្យ និងផ្ដល់សម្រង់តម្លៃលម្អិត និងច្បាស់លាស់ ដោយផ្គត់ផ្គង់ពីរោងចក្រ និងគ្រឿងចក្រផ្ទាល់ខ្លួនរបស់យើងទូទាំងកម្ពុជា",
  "Talk to us about your project": "ពិភាក្សាជាមួយយើងអំពីគម្រោងរបស់អ្នក", "Ang Village, Sangkat O’Char": "ភូមិអង្គ សង្កាត់អូរចារ",
  "Battambang City": "ក្រុងបាត់ដំបង", "Battambang Province, Cambodia": "ខេត្តបាត់ដំបង ប្រទេសកម្ពុជា",
  "Battambang · Head office": "បាត់ដំបង · ការិយាល័យកណ្ដាល", "Address to be confirmed": "អាសយដ្ឋាននឹងបញ្ជាក់ជូនពេលក្រោយ",
  "All rights reserved": "រក្សាសិទ្ធិគ្រប់យ៉ាង",
  "© 2026 Battambang Construction and Engineering Co., Ltd.": "© ២០២៦ ក្រុមហ៊ុន បាត់ដំបង សំណង់ និងវិស្វកម្ម ឯ.ក (Battambang Construction and Engineering Co., Ltd.)",
  // Project list
  "All projects": "គម្រោងទាំងអស់", "Filter projects by category": "ត្រងគម្រោងតាមប្រភេទ", "Sample content": "មាតិកាគំរូ",
  // Project page labels
  "Project details": "ព័ត៌មានលម្អិតគម្រោង", "Information": "ព័ត៌មាន", "Project owner": "ម្ចាស់គម្រោង", "Location": "ទីតាំង",
  "Project period": "រយៈពេលគម្រោង", "Category": "ប្រភេទ", "Scope of work": "វិសាលភាពការងារ",
  "The project in numbers": "គម្រោងជាតួលេខ", "Equipment & technical": "គ្រឿងចក្រ និងបច្ចេកទេស",
  "Fleet on site and the specifications we delivered to.": "គ្រឿងចក្រនៅការដ្ឋាន និងលក្ខណៈបច្ចេកទេសដែលយើងបានអនុវត្ត",
  "Equipment deployed": "គ្រឿងចក្រដែលបានប្រើប្រាស់", "Technical scope": "វិសាលភាពបច្ចេកទេស", "The result": "លទ្ធផល",
  "· keep scrolling": "· បន្តរំកិល", "mo": "ខែ",
  // Sample projects: names, places, owners
  "Bridge Foundation Piling": "ការបោះសសរស្ដម្ភគ្រឹះស្ពាន", "Logistics Warehouse Floor Slab": "កម្រាលបេតុងឃ្លាំងភស្តុភារ",
  "Commercial Complex Ready-Mix Supply": "ការផ្គត់ផ្គង់បេតុងលាយស្រេចសម្រាប់អគារពាណិជ្ជកម្ម",
  "Provincial Road Rehabilitation": "ការស្ដារផ្លូវខេត្តឡើងវិញ", "Mixed-Use Tower Foundations": "គ្រឹះអគារពហុមុខងារ",
  "Pump & Mixer Fleet Hire": "ការជួលឡានបូម និងឡានលាយបេតុង",
  "Stueng Saen": "ស្ទឹងសែន", "Poipet": "ប៉ោយប៉ែត", "Siem Reap City": "ក្រុងសៀមរាប", "Battambang Province": "ខេត្តបាត់ដំបង", "Chamkar Mon": "ចំការមន",
  "Provincial public works authority": "មន្ទីរសាធារណការខេត្ត", "Private logistics developer": "អ្នកអភិវឌ្ឍន៍ភស្តុភារឯកជន",
  "Private commercial developer": "អ្នកអភិវឌ្ឍន៍ពាណិជ្ជកម្មឯកជន", "Provincial administration": "រដ្ឋបាលខេត្ត",
  "Private developer": "អ្នកអភិវឌ្ឍន៍ឯកជន", "Main contractor, hotel development": "អ្នកម៉ៅការធំ គម្រោងអភិវឌ្ឍន៍សណ្ឋាគារ",
  // Sample projects: summaries
  "Reinforced concrete piles for a two-span river bridge on a provincial road, installed and tested by our own rigs and crews.":
    "សសរស្ដម្ភបេតុងអារម៉េសម្រាប់ស្ពានឆ្លងទន្លេពីរល្វែងលើផ្លូវខេត្ត ដែលបោះ និងតេស្ដដោយម៉ាស៊ីន និងក្រុមការងារផ្ទាល់ខ្លួនរបស់យើង",
  "A heavy-duty ground-bearing slab for a cross-border logistics warehouse, poured in planned bays and finished for racking and forklift traffic.":
    "កម្រាលបេតុងធន់ទម្ងន់ធ្ងន់សម្រាប់ឃ្លាំងភស្តុភារឆ្លងព្រំដែន ចាក់តាមផ្ទាំងដែលបានគ្រោងទុក និងបញ្ចប់ផ្ទៃសម្រាប់ធ្នើរ និងរថយន្តលើកទំនិញ",
  "Continuous ready-mix supply for a four-storey commercial complex, scheduled around the contractor's pour programme.":
    "ការផ្គត់ផ្គង់បេតុងលាយស្រេចជាបន្តបន្ទាប់សម្រាប់អគារពាណិជ្ជកម្មបួនជាន់ តាមកាលវិភាគចាក់បេតុងរបស់អ្នកម៉ៅការ",
  "Rehabilitation of a provincial road link, including sub-base works, drainage and a new asphalt wearing course.":
    "ការស្ដារផ្លូវតភ្ជាប់ខេត្តឡើងវិញ រួមមានការងារស្រទាប់គ្រឹះ ប្រព័ន្ធលូបង្ហូរទឹក និងស្រទាប់កៅស៊ូថ្មី",
  "Bored piles and a raft foundation for a mixed-use tower, with reinforcement, concrete and testing delivered by one team.":
    "សសរស្ដម្ភខួង និងគ្រឹះកម្រាលសម្រាប់អគារពហុមុខងារ ដោយការងារដែក បេតុង និងការតេស្ដអនុវត្តដោយក្រុមតែមួយ",
  "Concrete pump and mixer trucks hired with operators to a main contractor for structural pours on a coastal hotel.":
    "ការជួលឡានបូមបេតុង និងឡានលាយបេតុង រួមទាំងអ្នកបើកបរ ជូនអ្នកម៉ៅការធំ សម្រាប់ការចាក់បេតុងរចនាសម្ព័ន្ធសណ្ឋាគារតាមឆ្នេរសមុទ្រ",
  // Sample projects: scope
  "Supply of reinforced concrete piles": "ការផ្គត់ផ្គង់សសរស្ដម្ភបេតុងអារម៉េ", "Pile installation at abutments and pier": "ការបោះសសរស្ដម្ភនៅជើងស្ពាន និងសសរកណ្ដាល",
  "Pile cap concrete from our batching plant": "បេតុងក្បាលសសរស្ដម្ភពីរោងចក្ររបស់យើង", "Load testing and as-built records": "ការតេស្ដបន្ទុក និងកំណត់ត្រាសំណង់ជាក់ស្ដែង",
  "Sub-base preparation and compaction": "ការរៀបចំ និងបង្ហាប់ស្រទាប់គ្រឹះ", "Ready-mix supply from BTB plants": "ការផ្គត់ផ្គង់បេតុងលាយស្រេចពីរោងចក្រនៅបាត់ដំបង",
  "Slab placement in planned pour bays": "ការចាក់កម្រាលតាមផ្ទាំងដែលបានគ្រោងទុក", "Power-float finish and saw-cut joints": "ការរលោងផ្ទៃដោយម៉ាស៊ីន និងការកាត់សន្លាក់",
  "Mix designs for foundations, columns and slabs": "រូបមន្តលាយបេតុងសម្រាប់គ្រឹះ សសរ និងកម្រាល", "Scheduled delivery from plant to site": "ការដឹកជញ្ជូនតាមកាលវិភាគពីរោងចក្រទៅការដ្ឋាន",
  "Pumping for upper-floor slabs": "ការបូមបេតុងសម្រាប់កម្រាលជាន់លើ", "Slump and cube testing on every pour": "ការតេស្ដស្រុត និងគំរូគូបរាល់ការចាក់",
  "Earthworks and sub-base": "ការងារដី និងស្រទាប់គ្រឹះ", "Culverts and roadside drainage": "លូ និងប្រព័ន្ធបង្ហូរទឹកតាមផ្លូវ",
  "Asphalt paving and compaction": "ការក្រាលកៅស៊ូ និងការបង្ហាប់", "Road markings and handover": "ការគូសសញ្ញាផ្លូវ និងការប្រគល់",
  "Bored cast-in-place piles": "សសរស្ដម្ភខួងចាក់នៅនឹងកន្លែង", "Reinforcement cages fabricated on site": "ទ្រុងដែកដែលផលិតនៅការដ្ឋាន",
  "Continuous raft foundation pour": "ការចាក់គ្រឹះកម្រាលជាបន្តបន្ទាប់", "Integrity and load testing": "ការតេស្ដភាពរឹងមាំ និងបន្ទុក",
  "Pump trucks with experienced operators": "ឡានបូមបេតុងជាមួយអ្នកបើកបរមានបទពិសោធន៍", "Mixer trucks on daily call-off": "ឡានលាយបេតុងតាមការហៅប្រចាំថ្ងៃ",
  "On-site maintenance and refuelling": "ការថែទាំ និងបំពេញប្រេងនៅការដ្ឋាន", "Daily equipment reports": "របាយការណ៍គ្រឿងចក្រប្រចាំថ្ងៃ",
  // Sample projects: captions
  "Piling rig positioned at the east abutment": "ម៉ាស៊ីនបោះសសរស្ដម្ភនៅជើងស្ពានខាងកើត", "Rotary rig drilling at the pier": "ម៉ាស៊ីនខួងនៅសសរកណ្ដាលស្ពាន",
  "Piles set out across the foundation area": "សសរស្ដម្ភនៅទូទាំងតំបន់គ្រឹះ", "Completed piers above the waterline": "សសរស្ពានដែលបានបញ្ចប់លើផ្ទៃទឹក",
  "Warehouse frame rising over the prepared sub-base": "គ្រោងឃ្លាំងលើស្រទាប់គ្រឹះដែលបានរៀបចំ", "Crews levelling a pour bay": "ក្រុមការងារកំពុងរាបស្មើផ្ទាំងចាក់",
  "Hand finishing along the slab edge": "ការបញ្ចប់ផ្ទៃដោយដៃតាមគែមកម្រាល", "Roof structure above the completed floor": "រចនាសម្ព័ន្ធដំបូលលើកម្រាលដែលបានបញ្ចប់",
  "Mixer truck discharging beside the excavation": "ឡានលាយបេតុងកំពុងចាក់ក្បែររណ្ដៅជីក", "Deliveries staged around the site": "ការដឹកជញ្ជូនរៀបចំនៅជុំវិញការដ្ឋាន",
  "Mixer truck on arrival at the gate": "ឡានលាយបេតុងមកដល់ច្រកទ្វារ", "Columns and formwork ready for the next pour": "សសរ និងពុម្ពត្រៀមសម្រាប់ការចាក់បន្ទាប់",
  "Compaction of the new wearing course": "ការបង្ហាប់ស្រទាប់ផ្ទៃផ្លូវថ្មី", "Paver laying asphalt on the widened section": "ម៉ាស៊ីនក្រាលកៅស៊ូលើផ្នែកពង្រីក",
  "Finishing crews behind the paver": "ក្រុមការងារបញ្ចប់ផ្ទៃនៅពីក្រោយម៉ាស៊ីនក្រាល", "Reinforcement cages assembled for the core walls": "ទ្រុងដែកសម្រាប់ជញ្ជាំងស្នូល",
  "Steel fixers tying column starters": "ជាងដែកកំពុងចងដែកសសរ", "Reinforcement checked before the raft pour": "ការត្រួតពិនិត្យដែកមុនចាក់គ្រឹះកម្រាល",
  "Raft foundation after the continuous pour": "គ្រឹះកម្រាលក្រោយការចាក់ជាបន្តបន្ទាប់", "Boom pump set up at the street frontage": "ឡានបូមបេតុងតំឡើងនៅមុខផ្លូវ",
  "Operators preparing equipment for the day's pour": "អ្នកបើកបររៀបចំគ្រឿងចក្រសម្រាប់ការចាក់ប្រចាំថ្ងៃ", "Slab reinforcement awaiting the pump": "ដែកកម្រាលរង់ចាំការបូមបេតុង",
  // Sample projects: highlights
  "Piles installed": "សសរស្ដម្ភដែលបានបោះ", "Abutments and pier": "ជើងស្ពាន និងសសរកណ្ដាល", "Pile length": "ប្រវែងសសរស្ដម្ភ",
  "Average per pile": "មធ្យមក្នុងមួយសសរ", "Concrete supplied": "បេតុងដែលបានផ្គត់ផ្គង់", "Pile caps and deck": "ក្បាលសសរស្ដម្ភ និងផ្ទៃស្ពាន",
  "Slab area": "ផ្ទៃក្រឡាកម្រាល", "Single warehouse floor": "កម្រាលឃ្លាំងតែមួយ", "Concrete placed": "បេតុងដែលបានចាក់", "C30 ready-mix": "បេតុងលាយស្រេច C30",
  "Pour bays": "ផ្ទាំងចាក់", "Day pours": "ចាក់ពេលថ្ងៃ", "Slab thickness": "កម្រាស់កម្រាល", "Mesh reinforced": "ពង្រឹងដោយសំណាញ់ដែក",
  "Over 15 months": "ក្នុងរយៈពេល ១៥ ខែ", "Mix designs": "រូបមន្តលាយ", "C25 to C35": "C25 ដល់ C35", "Truck deliveries": "ការដឹកជញ្ជូនដោយឡាន",
  "Scheduled call-offs": "ការហៅតាមកាលវិភាគ", "Pours tested": "ការចាក់ដែលបានតេស្ដ", "Slump and cubes": "តេស្ដស្រុត និងគំរូគូប",
  "Road length": "ប្រវែងផ្លូវ", "Single carriageway": "ផ្លូវមួយជាន់", "Carriageway width": "ទទឹងផ្លូវ", "Plus shoulders": "បូកចិញ្ចើមផ្លូវ",
  "Culverts installed": "លូដែលបានដាក់", "Box and pipe": "លូប្រអប់ និងលូមូល", "Bored piles": "សសរស្ដម្ភខួង", "800 and 1,000 mm": "800 និង 1,000 mm",
  "Pile depth": "ជម្រៅសសរស្ដម្ភ", "Below cut-off": "ក្រោមកម្រិតកាត់", "Raft pour": "ការចាក់គ្រឹះកម្រាល", "Single continuous pour": "ចាក់តែម្ដងជាបន្តបន្ទាប់",
  // Sample projects: equipment, technical, outcomes
  "Mobile crane": "ស្ទូចចល័ត", "Pump truck": "ឡានបូមបេតុង", "Power trowels": "ម៉ាស៊ីនរលោងផ្ទៃ", "Vibratory roller": "ម៉ាស៊ីនបង្ហាប់ញ័រ",
  "Crawler crane": "ស្ទូចច្រវាក់", "Pile type": "ប្រភេទសសរស្ដម្ភ", "Precast RC square pile, 350 × 350 mm": "សសរស្ដម្ភបេតុងអារម៉េចាក់ស្រេចរាងការ៉េ 350 × 350 mm",
  "Concrete grade": "កម្រិតបេតុង", "C35 piles, C30 pile caps": "សសរស្ដម្ភ C35 ក្បាលសសរ C30", "Testing": "ការតេស្ដ",
  "Static load test; cube strength at 7 and 28 days": "តេស្ដបន្ទុកស្ថិត; កម្លាំងគំរូគូបនៅថ្ងៃទី ៧ និង ២៨", "Concrete": "បេតុង",
  "C30, slump 100 ± 25 mm": "C30 ស្រុត 100 ± 25 mm", "Finish": "ការបញ្ចប់ផ្ទៃ", "Power-floated with dry-shake hardener": "រលោងដោយម៉ាស៊ីន ជាមួយម្សៅពង្រឹងផ្ទៃ",
  "Joints": "សន្លាក់", "Saw-cut at 6 m centres, sealed": "កាត់សន្លាក់រៀងរាល់ 6 m និងបិទជិត", "Grades": "កម្រិតបេតុង",
  "C25 slabs, C30 columns, C35 foundations": "កម្រាល C25 សសរ C30 គ្រឹះ C35", "Quality control": "ការត្រួតពិនិត្យគុណភាព",
  "Slump at discharge; 6 cubes per 50 m³": "តេស្ដស្រុតពេលចាក់; គំរូគូប ៦ ក្នុង 50 m³", "Piles": "សសរស្ដម្ភ",
  "Bored cast-in-place, Ø 800 and 1,000 mm": "សសរខួងចាក់នៅនឹងកន្លែង Ø 800 និង 1,000 mm", "C40 raft, C35 piles": "គ្រឹះកម្រាល C40 សសរស្ដម្ភ C35",
  "Raft": "គ្រឹះកម្រាល", "2.2 m thick, poured continuously over 26 hours": "កម្រាស់ 2.2 m ចាក់ជាបន្តបន្ទាប់រយៈពេល ២៦ ម៉ោង",
  "Foundations were handed over ahead of the rainy season, so deck works could begin without delay.":
    "គ្រឹះត្រូវបានប្រគល់មុនរដូវវស្សា ដូច្នេះការងារផ្ទៃស្ពានអាចចាប់ផ្ដើមដោយគ្មានការពន្យារពេល",
  "The floor was ready for racking installation two weeks ahead of the tenant's fit-out.":
    "កម្រាលបានរួចរាល់សម្រាប់ការតំឡើងធ្នើរ មុនពេលកំណត់របស់អ្នកជួលពីរសប្ដាហ៍",
  "The upgraded link shortened the journey to the district market and keeps traffic moving through the wet season.":
    "ផ្លូវដែលបានកែលម្អបានកាត់បន្ថយរយៈពេលធ្វើដំណើរទៅផ្សារស្រុក និងធានាចរាចរណ៍ពេញរដូវវស្សា",
  "The raft was completed in a single pour with no cold joints, keeping the superstructure programme on track.":
    "គ្រឹះកម្រាលបានបញ្ចប់ក្នុងការចាក់តែម្ដង ដោយគ្មានសន្លាក់ត្រជាក់ ធានាថាកាលវិភាគសំណង់ផ្នែកខាងលើដំណើរការតាមគម្រោង",
};

// Templated strings: "View photo: …", "Select province …", "Next project: …", "… logo", dates, "Name, Place".
const PATTERNS: [RegExp, (...m: string[]) => string | null][] = [
  [/^View photo: (.+)$/, (s) => `មើលរូបភាព៖ ${tr(s)}`],
  [/^Select province (.+)$/, (s) => `ជ្រើសរើសខេត្ត ${tr(s)}`],
  [/^Next project: (.+)$/, (s) => `គម្រោងបន្ទាប់៖ ${tr(s)}`],
  [/^(.+): see our projects$/, (s) => `${tr(s)}៖ មើលគម្រោងរបស់យើង`],
  [/^Show (.+)$/, (s) => `បង្ហាញ ${tr(s)}`],
  [/^(.+) logo$/, (s) => `ឡូហ្គោ ${s}`],
  [/^Call (.+)$/, (s) => `ហៅទូរសព្ទ ${s}`],
  [/^(\d+) projects$/, (n) => `គម្រោង ${n}`],
  [/^(.+) \| BCE Construction$/, (s) => `${tr(s)} | BCE Construction`],
  [/^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b.*)$/, (s) => s.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => MONTHS[m])],
  [/^([^,]+), (.+)$/, (a, b) => {
    const ta = tr(a), tb = tr(b);
    return ta === a && tb === b ? null : `${ta} ${tb}`;
  }],
];

function tr(s: string): string {
  const hit = KM[s];
  if (hit) return hit;
  for (const [re, fn] of PATTERNS) {
    const m = s.match(re);
    if (m) {
      const out = fn(...m.slice(1));
      if (out) return out;
    }
  }
  return s;
}

/** Translates an English string for the current language (exact phrase or a known template); otherwise returns it. */
export const translate = (s: string) => (lang === "km" ? tr(s) : s);

const SKIP = "script,style,svg,[data-no-translate]";
const ATTRS = ["alt", "aria-label", "title"];

function trNode(n: Text) {
  const v = n.nodeValue ?? "";
  // One-off phrasing: an element can carry its own Khmer text (data-km) where a literal phrase-by-phrase swap won't read.
  const own = n.parentElement?.getAttribute("data-km");
  if (own != null && v.trim()) {
    if (v.trim() !== own) n.nodeValue = own;
    return;
  }
  if (!/[A-Za-z]/.test(v) || n.parentElement?.closest(SKIP)) return;
  const m = v.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  const out = tr(m[2]);
  if (out !== m[2]) n.nodeValue = m[1] + out + m[3];
}
function trAttrs(el: Element) {
  if (el.closest(SKIP)) return;
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (v && /[A-Za-z]/.test(v)) {
      const out = tr(v.trim());
      if (out !== v.trim()) el.setAttribute(a, out);
    }
  }
}
function trTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return trNode(root as Text);
  if (!(root instanceof Element)) return;
  trAttrs(root);
  root.querySelectorAll("[alt],[aria-label],[title]").forEach(trAttrs);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) trNode(w.currentNode as Text);
}

let observer: MutationObserver | null = null;
/** Translates the page now and keeps later changes translated (Khmer only); call again after re-rendering a page. */
export function applyLanguage(root: HTMLElement) {
  observer?.disconnect();
  observer = null;
  if (lang !== "km") return;
  trTree(root);
  observer = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "characterData") trNode(m.target as Text);
      else if (m.type === "attributes") trAttrs(m.target as Element);
      else m.addedNodes.forEach(trTree);
    }
  });
  observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
}
