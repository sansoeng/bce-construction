/**
 * BCE - Battambang Construction and Engineering Co., Ltd.
 * Main Interactive Script with Full Bilingual Support (English & Khmer)
 */

// 1. Projects Data Base (Extracted from BCE Corporate Profile 2026)
const projectsData = [
  {
    id: 1,
    titleEn: "18-Floor Residential Building",
    titleKh: "អគារស្នាក់នៅកម្ពស់ ១៨ ជាន់",
    category: "buildings",
    categoryEn: "High-Rise & Commercial",
    categoryKh: "អគារខ្ពស់ និងពាណិជ្ជកម្ម",
    clientEn: "Louk Oknha Vong Duong",
    clientKh: "លោកឧកញ៉ា វង្ស ឌួង",
    locationEn: "Poipet City, Banteay Meanchey",
    locationKh: "ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ",
    period: "2024 - 2026",
    scopeEn: "Concrete Structural Works & Architectural Finishing Works",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុង និងការងារបញ្ចប់សំណង់",
    image: "assets/images/project_page_14.jpg",
    signature: true
  },
  {
    id: 2,
    titleEn: "Build Bright University (BBU)",
    titleKh: "សាកលវិទ្យាល័យ បៀលប្រាយ (BBU)",
    category: "buildings",
    categoryEn: "Academic & Institutional",
    categoryKh: "អគារសិក្សា និងស្ថាប័ន",
    clientEn: "H.E. In Viracheat",
    clientKh: "ឯកឧត្តម អ៊ីន វីរៈជាតិ",
    locationEn: "Banteay Meanchey Province",
    locationKh: "ខេត្តបន្ទាយមានជ័យ",
    period: "2025 - 2026",
    scopeEn: "Academic Building Concrete Structural Works & Finishing",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុងអគារសិក្សា និងការងារបញ្ចប់",
    image: "assets/images/project_page_14.jpg",
    signature: true
  },
  {
    id: 3,
    titleEn: "Kampong Seima Water Supply Facility",
    titleKh: "រោងចក្រប្រព្រឹត្តកម្មទឹកស្អាតកំពង់សីមា",
    category: "infrastructure",
    categoryEn: "Civil & Infrastructure",
    categoryKh: "ហេដ្ឋារចនាសម្ព័ន្ធ និងសំណង់ស៊ីវិល",
    clientEn: "Mr. Kim Tieng",
    clientKh: "លោក គីម ទៀង",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "2025",
    scopeEn: "Reinforced Concrete Works for Water Treatment Basins & Facilities",
    scopeKh: "ការងារបេតុងអាមេសម្រាប់អាងចម្រោះទឹកស្អាត",
    image: "assets/images/project_page_15.jpg",
    signature: false
  },
  {
    id: 4,
    titleEn: "Hotel, Boutique & Restaurant Complex",
    titleKh: "សណ្ឋាគារ ប៊ូទិក និងភោជនីយដ្ឋាន",
    category: "buildings",
    categoryEn: "Commercial & Hospitality",
    categoryKh: "ពាណិជ្ជកម្ម និងបដិសណ្ឋារកិច្ច",
    clientEn: "Mr. Phuong Navuth",
    clientKh: "លោក ភួង ណាវុធ",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "2025 - 2026",
    scopeEn: "Complete Concrete Structural Works & Architectural Shell",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុង និងស្ថាបត្យកម្មសំណង់",
    image: "assets/images/project_page_15.jpg",
    signature: false
  },
  {
    id: 5,
    titleEn: "Ministry of Interior NASLA Academic Complex & Dormitory",
    titleKh: "អគារសិក្សា និងអន្តេវាសិកដ្ឋាន NASLA ក្រសួងមហាផ្ទៃ",
    category: "buildings",
    categoryEn: "Government & Institutional",
    categoryKh: "ស្ថាប័នរដ្ឋ និងការអប់រំ",
    clientEn: "Ministry of Interior (MoI)",
    clientKh: "ក្រសួងមហាផ្ទៃ",
    locationEn: "Phnom Penh Capital",
    locationKh: "រាជធានីភ្នំពេញ",
    period: "2023 - 2026",
    scopeEn: "Concrete Structural Works, Corridor Infrastructure & Finishing",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុង អគារសិក្សា និងហេដ្ឋារចនាសម្ព័ន្ធ",
    image: "assets/images/project_page_16.jpg",
    signature: true
  },
  {
    id: 6,
    titleEn: "The Rehabilitation of Teuk Krahom Subprojects (Lot 1)",
    titleKh: "គម្រោងស្តារប្រព័ន្ធធារាសាស្ត្រទឹកក្រហម (កញ្ចប់ទី ១)",
    category: "infrastructure",
    categoryEn: "Hydraulic & Infrastructure",
    categoryKh: "ប្រព័ន្ធធារាសាស្ត្រ និងហេដ្ឋារចនាសម្ព័ន្ធ",
    clientEn: "Ministry of Water Resources and Meteorology",
    clientKh: "ក្រសួងធនធានទឹក និងឧតុនិយម",
    locationEn: "Rovieng District, Preah Vihear",
    locationKh: "ស្រុករវៀង ខេត្តព្រះវិហារ",
    period: "2025 - Present",
    scopeEn: "U-Shape Concrete Canal, Structure Works, & Precast Concrete Canal",
    scopeKh: "ប្រឡាយបេតុងរាងអក្សរ U និងសំណង់បេតុងប្រឡាយមេ",
    image: "assets/images/project_page_17.jpg",
    signature: true
  },
  {
    id: 7,
    titleEn: "Three-Apartment Residential Building",
    titleKh: "អគារអាផាតមិនស្នាក់នៅ ៣ ខ្នង",
    category: "buildings",
    categoryEn: "Residential",
    categoryKh: "លំនៅឋានស្នាក់នៅ",
    clientEn: "Mr. Tay Thaisong",
    clientKh: "លោក តាយ ថៃស៊ុង",
    locationEn: "Phnom Penh Capital",
    locationKh: "រាជធានីភ្នំពេញ",
    period: "2025 - Present",
    scopeEn: "Concrete Structural & Exterior Finishing Works",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុង និងការងារបញ្ចប់ខាងក្រៅ",
    image: "assets/images/project_page_18.jpg",
    signature: false
  },
  {
    id: 8,
    titleEn: "Rolous Pagoda Reinforced Concrete Perimeter Wall",
    titleKh: "របងបេតុងវត្តរលួស",
    category: "infrastructure",
    categoryEn: "Community & Civil",
    categoryKh: "សហគមន៍ និងស៊ីវិល",
    clientEn: "TSK Construction",
    clientKh: "ក្រុមហ៊ុន TSK Construction",
    locationEn: "Moungrussei District, Battambang",
    locationKh: "ស្រុកមោងឫស្សី ខេត្តបាត់ដំបង",
    period: "2025 - 2026",
    scopeEn: "Ready-Mix Concrete Supply, Pumping & Retaining Wall Construction",
    scopeKh: "ផ្គត់ផ្គង់បេតុងលាយស្រេច ចាក់បេតុង និងសាងសង់របងការពារ",
    image: "assets/images/project_page_18.jpg",
    signature: false
  },
  {
    id: 9,
    titleEn: "11-Floor High-Rise Residential Building",
    titleKh: "អគារស្នាក់នៅទំនើបកម្ពស់ ១១ ជាន់",
    category: "buildings",
    categoryEn: "High-Rise & Commercial",
    categoryKh: "អគារខ្ពស់ និងពាណិជ្ជកម្ម",
    clientEn: "Louk Oknha Vong Duong",
    clientKh: "លោកឧកញ៉ា វង្ស ឌួង",
    locationEn: "Poipet City, Banteay Meanchey",
    locationKh: "ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ",
    period: "2023 - 2024",
    scopeEn: "High-Strength Structural Concrete & High-Rise Finishing",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុងកម្លាំងខ្ពស់ និងការងារបញ្ចប់",
    image: "assets/images/project_page_19.jpg",
    signature: false
  },
  {
    id: 10,
    titleEn: "Condo Building (Borey Rattanak)",
    titleKh: "អគារខុនដូ (បុរី រតនៈ)",
    category: "buildings",
    categoryEn: "Residential Development",
    categoryKh: "គម្រោងអភិវឌ្ឍន៍លំនៅឋាន",
    clientEn: "H.E. Sok Sokhon",
    clientKh: "ឯកឧត្តម សុក សុខុន",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "2024 - Present",
    scopeEn: "Multi-Storey Concrete Structural Construction",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុងពហុជាន់",
    image: "assets/images/project_page_19.jpg",
    signature: false
  },
  {
    id: 11,
    titleEn: "Battambang Conch Cement Factory Facility",
    titleKh: "រោងចក្រស៊ីម៉ងត៍ បាត់ដំបង ខនឆ៍",
    category: "industrial",
    categoryEn: "Industrial & Manufacturing",
    categoryKh: "ឧស្សាហកម្ម និងរោងចក្រផលិត",
    clientEn: "Mr. Songfu",
    clientKh: "លោក សុង ហ៊្វូ (Mr. Songfu)",
    locationEn: "Ratanak Mondul District, Battambang",
    locationKh: "ស្រុករតនមណ្ឌល ខេត្តបាត់ដំបង",
    period: "31 Mar 2026 - 11 May 2026",
    scopeEn: "High-Volume Ready-Mix Supply & Heavy Industrial Placement",
    scopeKh: "ផ្គត់ផ្គង់បេតុងលាយស្រេចខ្នាតធំ និងការចាក់បេតុងឧស្សាហកម្ម",
    image: "assets/images/project_page_20.jpg",
    signature: true
  },
  {
    id: 12,
    titleEn: "Tela Gas & Commercial Station Concrete Works",
    titleKh: "ស្ថានីយប្រេងឥន្ធនៈ តេលា",
    category: "industrial",
    categoryEn: "Commercial & Energy",
    categoryKh: "ពាណិជ្ជកម្ម និងថាមពល",
    clientEn: "H.E. Khiev Satya",
    clientKh: "ឯកឧត្តម ខៀវ សត្យា",
    locationEn: "Thmar Koul District, Battambang",
    locationKh: "ស្រុកថ្មគោល ខេត្តបាត់ដំបង",
    period: "2025 - 2026",
    scopeEn: "Heavy-Duty Pavement, Fuel Pad Slabs & Pumping Operations",
    scopeKh: "ការចាក់បេតុងផ្លូវធន់ធ្ងន់ និងបាតស្ថានីយប្រេងឥន្ធនៈ",
    image: "assets/images/project_page_20.jpg",
    signature: false
  },
  {
    id: 13,
    titleEn: "4-Floor Hotel (LOD) Building",
    titleKh: "អគារសណ្ឋាគារ ៤ ជាន់ (LOD)",
    category: "buildings",
    categoryEn: "Commercial & Hospitality",
    categoryKh: "ពាណិជ្ជកម្ម និងបដិសណ្ឋារកិច្ច",
    clientEn: "Mr. Song Chamnan",
    clientKh: "លោក សុង ចំណាន",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "2025",
    scopeEn: "Ready-Mix Concrete Supply, Structural Slabs & Pumping",
    scopeKh: "ផ្គត់ផ្គង់បេតុងលាយស្រេច ចាក់ប្លង់សេ និងការបាញ់បេតុង",
    image: "assets/images/project_page_21.jpg",
    signature: false
  },
  {
    id: 14,
    titleEn: "Chroy Mteas Pagoda Concrete Road",
    titleKh: "ផ្លូវបេតុងវត្តជ្រោយម្ទេស",
    category: "infrastructure",
    categoryEn: "Roads & Civil Infrastructure",
    categoryKh: "ផ្លូវថ្នល់ និងហេដ្ឋារចនាសម្ព័ន្ធ",
    clientEn: "Chroy Mteas Pagoda Committee",
    clientKh: "គណៈកម្មការវត្តជ្រោយម្ទេស",
    locationEn: "Thmar Koul District, Battambang",
    locationKh: "ស្រុកថ្មគោល ខេត្តបាត់ដំបង",
    period: "2026",
    scopeEn: "Concrete Road Delivery, Surface Finishing & Joint Cutting",
    scopeKh: "ការដឹកជញ្ជូន ចាក់បេតុង និងការរៀបចំកម្រាលផ្លូវបេតុង",
    image: "assets/images/project_page_21.jpg",
    signature: false
  },
  {
    id: 15,
    titleEn: "Anlong Run 60MW Solar Farm Infrastructure",
    titleKh: "កសិដ្ឋានថាមពលពន្លឺព្រះអាទិត្យ អន្លង់រុន",
    category: "industrial",
    categoryEn: "Renewable Energy & Industrial",
    categoryKh: "ថាមពលកកើតឡើងវិញ និងឧស្សាហកម្ម",
    clientEn: "EM Construction Import Export Co., Ltd",
    clientKh: "ក្រុមហ៊ុន EM Construction Import Export Co., Ltd",
    locationEn: "Anlong Run, Thmar Koul, Battambang",
    locationKh: "ឃុំអន្លង់រុន ស្រុកថ្មគោល ខេត្តបាត់ដំបង",
    period: "2025 - 2026",
    scopeEn: "Foundation Works, Inverter Pad Slabs & Heavy Pumping",
    scopeKh: "ការងារគ្រឹះបេតុង បាតឧបករណ៍បម្លែង និងការចាក់បេតុង",
    image: "assets/images/project_page_22.jpg",
    signature: true
  },
  {
    id: 16,
    titleEn: "Chroy Pros Sea Port Infrastructure & Access Roads",
    titleKh: "ហេដ្ឋារចនាសម្ព័ន្ធកំពង់ផែសមុទ្រជ្រោយប្រស់",
    category: "infrastructure",
    categoryEn: "Marine & Port Infrastructure",
    categoryKh: "កំពង់ផែ និងហេដ្ឋារចនាសម្ព័ន្ធសមុទ្រ",
    clientEn: "Samdech Pichey Sena Tea Banh",
    clientKh: "សម្តេចពិជ័យសេនា ទៀ បាញ់",
    locationEn: "Chroy Pros, Koh Kong Province",
    locationKh: "ឃុំជ្រោយប្រស់ ខេត្តកោះកុង",
    period: "2025 - 2026",
    scopeEn: "Marine Concrete Structural Works, Port Facilities & Coastal Roads",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុងជាប់ទឹកប្រៃ កំពង់ផែ និងផ្លូវបេតុង",
    image: "assets/images/project_page_23.jpg",
    signature: true
  },
  {
    id: 17,
    titleEn: "O'Sandas High-Capacity Weighbridge Station",
    titleKh: "ស្ថានីយជញ្ជីងថ្លឹងរថយន្តអូរដានដាស",
    category: "industrial",
    categoryEn: "Logistics & Transport",
    categoryKh: "ភស្តុភារ និងដឹកជញ្ជូន",
    clientEn: "SUMEC International Technology Co., Ltd",
    clientKh: "ក្រុមហ៊ុន SUMEC International Technology Co., Ltd",
    locationEn: "Sangkae District, Battambang",
    locationKh: "ស្រុកសង្កែ ខេត្តបាត់ដំបង",
    period: "26 Dec 2025 - 04 Aug 2026",
    scopeEn: "High-Strength Ready-Mix Supply, Placement & Strict Quality Verification",
    scopeKh: "ផ្គត់ផ្គង់បេតុងកម្លាំងខ្ពស់ ការត្រួតពិនិត្យគុណភាព និងការចាក់គ្រឹះ",
    image: "assets/images/project_page_24.jpg",
    signature: false
  },
  {
    id: 18,
    titleEn: "Battambang Luxury Hotel & Resort",
    titleKh: "សណ្ឋាគារ និងរីសតប្រណីត បាត់ដំបង",
    category: "buildings",
    categoryEn: "Commercial & Hospitality",
    categoryKh: "ពាណិជ្ជកម្ម និងបដិសណ្ឋារកិច្ច",
    clientEn: "Mrs. Thouen Sophea",
    clientKh: "លោកស្រី ធឿន សុភា",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "26 Dec 2025 - 04 Aug 2026",
    scopeEn: "Waterproof Concrete for Swimming Pool & Multi-Level Structural Slabs",
    scopeKh: "បេតុងការពារជ្រាបទឹកសម្រាប់អាងហែលទឹក និងប្លង់សេអគារ",
    image: "assets/images/project_page_25.jpg",
    signature: false
  },
  {
    id: 19,
    titleEn: "Concrete Highway Mum 3 Region",
    titleKh: "ផ្លូវបេតុងយុទ្ធសាស្ត្រតំបន់មុំ៣",
    category: "infrastructure",
    categoryEn: "National Highways & Defense",
    categoryKh: "ផ្លូវជាតិយុទ្ធសាស្ត្រ និងការពារជាតិ",
    clientEn: "Ministry of National Defence",
    clientKh: "ក្រសួងការពារជាតិ",
    locationEn: "Chheb District, Preah Vihear",
    locationKh: "ស្រុកឆែប ខេត្តព្រះវិហារ",
    period: "26 Dec 2025 - 04 Aug 2026",
    scopeEn: "Heavy-Duty Concrete Road Pavement, Pumping & Long-Distance Dispatch",
    scopeKh: "ការស្ថាបនាផ្លូវបេតុងធន់ធ្ងន់ ការដឹកជញ្ជូនចម្ងាយឆ្ងាយ និងចាក់បេតុង",
    image: "assets/images/project_page_26.jpg",
    signature: true
  },
  {
    id: 20,
    titleEn: "Battambang Modern Polyclinic Building",
    titleKh: "អគារពហុគ្លីនិកទំនើប បាត់ដំបង",
    category: "buildings",
    categoryEn: "Healthcare & Institutional",
    categoryKh: "សុខាភិបាល និងស្ថាប័ន",
    clientEn: "Mr. Sok Vannara",
    clientKh: "លោក សុក វណ្ណារ៉ា",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "2025 - Present",
    scopeEn: "Multi-Floor Reinforced Concrete Structure & Specialized Boom Pumping",
    scopeKh: "គ្រោងឆ្អឹងបេតុងអាមេពហុជាន់ និងការបាញ់បេតុងឡើងជាន់ខ្ពស់",
    image: "assets/images/project_page_27.jpg",
    signature: false
  },
  {
    id: 21,
    titleEn: "Urban Road 550 Urban Expansion",
    titleKh: "ផ្លូវបេតុង ៥៥០ ក្រុងបាត់ដំបង",
    category: "infrastructure",
    categoryEn: "Urban Roads & Civil",
    categoryKh: "ផ្លូវក្រុង និងសំណង់ស៊ីវិល",
    clientEn: "H.E. Tum Helhangry",
    clientKh: "ឯកឧត្តម ទុំ ហ៊ែលហង់គ្រី",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "2026",
    scopeEn: "Sub-base Preparation, Concrete Road Slabs, Laser Leveling & Finishing",
    scopeKh: "ការរៀបចំបាតក្រោម ចាក់បេតុងកម្រាលផ្លូវ និងការកាត់ថ្នេរពង្រីក",
    image: "assets/images/project_page_28.jpg",
    signature: false
  },
  {
    id: 22,
    titleEn: "Sala Ta On Dam & Water Regulating Gate",
    titleKh: "សំណង់ទំនប់ និងទ្វារទឹកសាលាតាអន",
    category: "infrastructure",
    categoryEn: "Hydraulic Engineering",
    categoryKh: "វិស្វកម្មធារាសាស្ត្រ និងទំនប់ទឹក",
    clientEn: "Punloeu Banteay Srey Construction Co., Ltd",
    clientKh: "ក្រុមហ៊ុន ពន្លឺបន្ទាយស្រី ខនស្ត្រាក់សិន",
    locationEn: "Ek Phnom District, Battambang",
    locationKh: "ស្រុកឯកភ្នំ ខេត្តបាត់ដំបង",
    period: "15 May 2025 - 26 Jul 2025",
    scopeEn: "High-Performance Waterproof Concrete for Dam Slope & Spillways",
    scopeKh: "បេតុងធន់ទឹកកម្លាំងខ្ពស់សម្រាប់ជម្រាលទំនប់ និងសំណង់បង្ហៀរទឹក",
    image: "assets/images/project_page_29.jpg",
    signature: true
  },
  {
    id: 23,
    titleEn: "Prek Trap Concrete Bridge & Pier Works",
    titleKh: "ស្ពានបេតុងព្រែកត្រាប់",
    category: "infrastructure",
    categoryEn: "Bridges & Civil Infrastructure",
    categoryKh: "ស្ពាន និងហេដ្ឋារចនាសម្ព័ន្ធ",
    clientEn: "Ministry of Rural Development",
    clientKh: "ក្រសួងអភិវឌ្ឍន៍ជនបទ",
    locationEn: "Ek Phnom District, Battambang",
    locationKh: "ស្រុកឯកភ្នំ ខេត្តបាត់ដំបង",
    period: "28 Feb 2026 - 11 Jun 2026",
    scopeEn: "Bridge Piers, Abutments, Heavy Foundation Structures & Deep Concrete Pumping",
    scopeKh: "សសរស្ពាន ជើងទម្រស្ពាន និងការចាក់បេតុងគ្រឹះស្ពាន",
    image: "assets/images/project_page_30.jpg",
    signature: true
  },
  {
    id: 24,
    titleEn: "Swiftlet House Facility (Tamoearn)",
    titleKh: "អគារចិញ្ចឹមត្រចៀកកាំ តាមើន",
    category: "industrial",
    categoryEn: "Agricultural & Commercial",
    categoryKh: "កសិ-ពាណិជ្ជកម្ម",
    clientEn: "Dr. Yik Kuok",
    clientKh: "លោកវេជ្ជបណ្ឌិត យីក គក់",
    locationEn: "Thmar Koul District, Battambang",
    locationKh: "ស្រុកថ្មគោល ខេត្តបាត់ដំបង",
    period: "15 May 2024 - 25 Sep 2024",
    scopeEn: "Specialized Concrete Structural Works & Insulated Wall Slabs",
    scopeKh: "ការងាររចនាសម្ព័ន្ធបេតុង និងជញ្ជាំងរក្សាសីតុណ្ហភាព",
    image: "assets/images/project_page_31.jpg",
    signature: false
  },
  {
    id: 25,
    titleEn: "Robos Bridge (Near Sampov Mountain)",
    titleKh: "ស្ពានរបោះ (ក្បែរភ្នំសំពៅ)",
    category: "infrastructure",
    categoryEn: "Bridges & Civil Works",
    categoryKh: "ស្ពាន និងសំណង់ស៊ីវិល",
    clientEn: "H.E. Pronh Ritha",
    clientKh: "ឯកឧត្តម ព្រហ្ម រីថា",
    locationEn: "Banan District, Battambang",
    locationKh: "ស្រុកបាណន់ ខេត្តបាត់ដំបង",
    period: "26 May 2025 - 16 Jun 2025",
    scopeEn: "Concrete Framework, Precision Pumping & Riverbank Structural Slabs",
    scopeKh: "ការងារពុម្ពបេតុង ការបាញ់បេតុង និងការការពារមាត់ស្ទឹង",
    image: "assets/images/project_page_32.jpg",
    signature: false
  },
  {
    id: 26,
    titleEn: "Otaki Rice Mill Logistics Warehouse Access Road",
    titleKh: "ផ្លូវបេតុងចូលឃ្លាំងស្តុកស្រូវអូតាគី",
    category: "industrial",
    categoryEn: "Industrial Logistics & Slabs",
    categoryKh: "ភស្តុភារ និងកម្រាលឧស្សាហកម្ម",
    clientEn: "Mrs. Soun Thouk",
    clientKh: "លោកស្រី ស៊ុន ធួក",
    locationEn: "Chrey Commune, Thmar Koul, Battambang",
    locationKh: "ឃុំជ្រៃ ស្រុកថ្មគោល ខេត្តបាត់ដំបង",
    period: "29 May 2026 - 10 Jun 2026",
    scopeEn: "High-Load Warehouse Pavement & Reinforced Concrete Truckways",
    scopeKh: "កម្រាលផ្លូវបេតុងទ្រទម្ងន់ធ្ងន់សម្រាប់រថយន្តកុងតឺន័រ",
    image: "assets/images/project_page_32.jpg",
    signature: false
  },
  {
    id: 27,
    titleEn: "Deep Pile Foundation Works (Outakam Project)",
    titleKh: "ការងារគ្រឹះសសរស្ដម្ភ គម្រោងអូតាកាំ",
    category: "piling",
    categoryEn: "Piling & Deep Foundations",
    categoryKh: "សេវាកម្មគ្រឹះសសរស្ដម្ភ",
    clientEn: "Mr. So Reaksmey",
    clientKh: "លោក សូ រស្មី",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "07 Oct 2024 - 10 Nov 2024",
    scopeEn: "Specialized Hydraulic Piling Drilling, Reinforcement & Load Testing",
    scopeKh: "ការខួង និងដាំសសរគ្រឹះបេតុងដោយម៉ាស៊ីនទំនើប និងតេស្តកម្លាំងទ្រ",
    image: "assets/images/project_page_33.jpg",
    signature: true
  },
  {
    id: 28,
    titleEn: "Battambang Special Education School - Foundation Piling",
    titleKh: "ការងារបុកគ្រឹះ សាលាអប់រំពិសេសបាត់ដំបង",
    category: "piling",
    categoryEn: "Piling & Deep Foundations",
    categoryKh: "សេវាកម្មគ្រឹះសសរស្ដម្ភ",
    clientEn: "Mr. Sy Rattanak",
    clientKh: "លោក ស៊ី រតនៈ",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "07 Jul 2026 - 10 Aug 2026",
    scopeEn: "Precision Crane Lifting, Positioning, Alignment & Deep Driving Operations",
    scopeKh: "ការស្ទូច តម្រង់ទិស និងបុកសសរគ្រឹះបេតុងអាមេដោយសុវត្ថិភាពខ្ពស់",
    image: "assets/images/project_page_33.jpg",
    signature: false
  },
  {
    id: 29,
    titleEn: "Precision Foundation Piling for Medical Polyclinic",
    titleKh: "ការងារគ្រឹះសសរស្ដម្ភ អគារពហុគ្លីនិក",
    category: "piling",
    categoryEn: "Piling & Deep Foundations",
    categoryKh: "សេវាកម្មគ្រឹះសសរស្ដម្ភ",
    clientEn: "Dr. Sok Vannara",
    clientKh: "លោកវេជ្ជបណ្ឌិត សុក វណ្ណារ៉ា",
    locationEn: "Battambang City, Battambang",
    locationKh: "ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង",
    period: "04 Nov 2025 - 10 Dec 2025",
    scopeEn: "Hydraulic Piling in Dense Urban Setting with Strict Vibration Limits",
    scopeKh: "ការដាំសសរគ្រឹះក្នុងទីប្រជុំជនដោយការកាត់បន្ថយរំញ័រ",
    image: "assets/images/project_page_34.jpg",
    signature: false
  },
  {
    id: 30,
    titleEn: "Supply & Hydraulic Driving of Piles for 100 MW Solar Power Plant",
    titleKh: "ផ្គត់ផ្គង់ និងដាំសសរគ្រឹះរោងចក្រថាមពលព្រះអាទិត្យ ១០០ មេហ្គាវ៉ាត់",
    category: "piling",
    categoryEn: "Piling & Clean Energy",
    categoryKh: "គ្រឹះសសរស្ដម្ភ និងថាមពលស្អាត",
    clientEn: "Schneitec Co., Ltd",
    clientKh: "ក្រុមហ៊ុន Schneitec Co., Ltd",
    locationEn: "Chhoeur Tom, Krakor, Pursat",
    locationKh: "ឃុំឈើតុំ ស្រុកក្រគរ ខេត្តពោធិ៍សាត់",
    period: "20 Feb 2026 - 06 Mar 2026",
    scopeEn: "High-Volume Precast Concrete Pile Supply & Precision Machine Installation",
    scopeKh: "ការផ្គត់ផ្គង់សសរគ្រឹះបេតុងរាប់ពាន់ដើម និងការបុកដាំគ្រឹះដោយគ្រឿងចក្រធំៗ",
    image: "assets/images/project_page_35.jpg",
    signature: true
  }
];

// 2. Bilingual Dictionary
const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About Us",
    nav_services: "Core Services",
    nav_fleet: "Machinery & Fleet",
    nav_coverage: "Operational Reach",
    nav_projects: "Projects",
    nav_qa: "Quality & HSE",
    nav_clients: "Clients & Partners",
    nav_contact: "Contact",
    btn_request_quote: "Get a Quote",
    btn_call_us: "Direct Hotline",
    hero_badge: "30+ Years of Engineering Excellence (Since 1995)",
    hero_title_1: "Quality Concrete.",
    hero_title_2: "Trusted Construction.",
    hero_subtitle: "Battambang Construction and Engineering Co., Ltd. (BCE) is Cambodia's premier provider of automated ready-mix concrete, precision reinforced piling, civil construction, and heavy equipment logistics.",
    btn_explore_projects: "View Our Projects",
    btn_calculate_concrete: "Concrete Calculator",
    stat_experience_val: "30+",
    stat_experience_lbl: "Years of Proven Track Record",
    stat_plants_val: "4",
    stat_plants_lbl: "Batching Plants (70 m³/hr)",
    stat_trucks_val: "41",
    stat_trucks_lbl: "Mixer Trucks (GPS Tracked)",
    stat_projects_val: "128+",
    stat_projects_lbl: "Major Projects Delivered",
    stat_provinces_val: "14",
    stat_provinces_lbl: "Provinces & Phnom Penh Served",
    about_tag: "Company Overview",
    about_heading: "Building Excellence. Delivering Confidence Across Cambodia.",
    about_p1: "Established in 1995 under Hong Huot Ly Co., Ltd. and restructured in 2020 as Battambang Construction and Engineering Co., Ltd., BCE has continuously pioneered modern construction and ready-mix concrete solutions in Cambodia.",
    about_p2: "With modern computerized batching plants, a fleet of over 41 mixer trucks and 8 pump trucks, an in-house certified testing laboratory, and an experienced engineering workforce, we ensure that every structure built with BCE stands strong for generations.",
    chairwoman_title: "Chairwoman's Message",
    chairwoman_quote: "\"At BCE, quality is not simply a requirement—it is the principle that guides every aspect of our operations. From material selection to construction execution, we build trust, safety, and lasting value for Cambodia's future.\"",
    chairwoman_name: "Ms. Loeung Chan",
    chairwoman_role: "Chairwoman, Battambang Construction and Engineering Co., Ltd.",
    values_title: "Our Core Values",
    val_quality_title: "Quality Assured",
    val_quality_desc: "We adhere strictly to international ACI standards and rigorous laboratory verification for every cubic meter of concrete.",
    val_safety_title: "Safety First",
    val_safety_desc: "Zero-compromise occupational safety protocols protecting our workforce, partners, and job sites.",
    val_integrity_title: "Integrity & Trust",
    val_integrity_desc: "Transparent business conduct, precise mix formulations, and honest client relationships.",
    val_innovation_title: "Modern Technology",
    val_innovation_desc: "Computerized batching systems, real-time GPS fleet telemetry, and advanced hydraulic machinery.",
    val_teamwork_title: "Engineering Team",
    val_teamwork_desc: "15 licensed engineers and 71 dedicated professionals driving flawless execution.",
    val_sustain_title: "Sustainable Growth",
    val_sustain_desc: "Environmentally responsible water recycling, dust control, and low-waste production systems.",
    services_tag: "Core Capabilities",
    services_heading: "Comprehensive Construction & Ready-Mix Solutions",
    srv_1_title: "Ready-Mix Concrete Supply",
    srv_1_desc: "Computerized batching with 70 m³/hr capacity per plant. High slump retention, tailored mix designs from 15 MPa to 45 MPa, and reliable on-time site dispatch.",
    srv_2_title: "Reinforced Concrete Piling",
    srv_2_desc: "Specialized hydraulic piling drivers and deep foundation solutions. Complete precast pile manufacturing, transport, laser alignment, and driving.",
    srv_3_title: "Civil & Structural Construction",
    srv_3_desc: "End-to-end building construction, industrial facilities, bridges, irrigation canals, and high-strength concrete structures.",
    srv_4_title: "Concrete Slab & Pavement Works",
    srv_4_desc: "High-tolerance industrial warehouse floors, heavy transport highways, commercial slabs, laser screeding, and power trowel mirror finishes.",
    srv_5_title: "Heavy Equipment & Truck Rental",
    srv_5_desc: "Long-arm concrete pump trucks, 7-10 m³ mixer trucks, wheel loaders, telescopic crane trucks, tower cranes, and construction hoists.",
    fleet_tag: "Machinery & Equipment",
    fleet_heading: "Owned Heavy Machinery Fleet & Advanced Production Assets",
    fleet_desc: "BCE owns and operates one of Northwestern Cambodia's most modern and well-maintained construction fleets.",
    fleet_plant: "Batching Plants",
    fleet_plant_spec: "4 Computerized Units • 70 m³/hr per plant capacity • Automated moisture compensation",
    fleet_mixers: "Concrete Mixer Trucks",
    fleet_mixers_spec: "41 Units • 7 to 10 m³ capacity • Equipped with real-time GPS tracking",
    fleet_pumps: "Concrete Pump Trucks",
    fleet_pumps_spec: "8 Heavy-Duty Units • Extended boom reaches for high-rise & bridge projects",
    fleet_piling: "Hydraulic Piling Rigs",
    fleet_piling_spec: "7 Heavy Piling Drivers • High stability for tough soil formations & solar plants",
    fleet_cranes: "Crane & Transport Trucks",
    fleet_cranes_spec: "6 Telescopic Crane Trucks + 8 High-Capacity Tower Cranes",
    fleet_lab: "Calibrated QC Laboratory",
    fleet_lab_spec: "DYE-2000 Compressive Testing Machine, slump test apparatus, sieve analysis",
    coverage_tag: "Operational Footprint",
    coverage_heading: "We Go Where You Build — 14 Provinces Covered",
    coverage_desc: "Headquartered in Battambang City with rapid mobile batching and delivery deployment across Northwestern Cambodia, Phnom Penh, and coastal regions.",
    map_hq_label: "Headquarters & Central Plant",
    map_hq_val: "Battambang City (O'Char)",
    map_active_label: "Operational Service Network",
    map_active_provinces: "Battambang, Phnom Penh, Banteay Meanchey, Pailin, Pursat, Kampong Chhnang, Koh Kong, Preah Sihanouk, Kandal, Kampong Thom, Siem Reap, Oddar Meanchey, Preah Vihear, Stung Treng.",
    projects_tag: "Proven Track Record",
    projects_heading: "Featured Project Portfolio (30+ Completed & Ongoing)",
    filter_all: "All Projects (30)",
    filter_buildings: "High-Rise & Buildings",
    filter_infrastructure: "Infrastructure & Roads",
    filter_industrial: "Industrial & Solar",
    filter_piling: "Piling & Foundations",
    calc_tag: "Smart Utility",
    calc_heading: "Interactive Ready-Mix Concrete Volume Calculator",
    calc_desc: "Plan your project requirement accurately. Enter your structural dimensions below to estimate required concrete volume in cubic meters (m³) and request a prefilled quote on Telegram.",
    calc_shape_slab: "Concrete Slab / Floor",
    calc_shape_footing: "Isolated Footing / Foundation",
    calc_shape_column: "Rectangular Column / Beam",
    calc_dim_l: "Length (meters)",
    calc_dim_w: "Width (meters)",
    calc_dim_t: "Thickness / Height (meters)",
    calc_grade: "Target Strength Grade (ACI 211.1)",
    calc_btn: "Calculate Volume",
    calc_res_volume: "Estimated Net Volume:",
    calc_res_order: "Recommended Order (+5% buffer):",
    calc_btn_quote: "Order this Volume via Telegram @thendLP",
    qa_tag: "Quality & Safety Standards",
    qa_heading: "Laboratory Quality Assurance & HSE Commitment",
    qa_desc: "At BCE, every batch undergoes a 5-step quality verification cycle certified by the Ministry of Public Works and Transport.",
    qa_step_1: "1. Raw Material Check",
    qa_step_1_desc: "Rigorous sieve testing on coarse/fine aggregates, water pH testing, and supplier mill test certificates.",
    qa_step_2: "2. Production Control",
    qa_step_2_desc: "Automated digital weighing scales with valid government calibration stamps.",
    qa_step_3: "3. Fresh Concrete Test",
    qa_step_3_desc: "Workability slump tests and sample cube/cylinder casting at batching plant and job site.",
    qa_step_4: "4. Strength Testing",
    qa_step_4_desc: "7-day and 28-day compressive crushing tests utilizing our calibrated DYE-2000 machine.",
    qa_step_5: "5. Quality Certification",
    qa_step_5_desc: "Formal quality documentation and test result certificates issued to client engineers.",
    partners_tag: "Strategic Network",
    partners_heading: "Trusted by Government Ministries, Contractors & Key Suppliers",
    contact_tag: "Let's Build Together",
    contact_heading: "Get in Touch with BCE Today",
    contact_desc: "Ready to discuss your next construction project or ready-mix supply schedule? Contact our engineering team for immediate assistance and competitive rates.",
    form_name: "Full Name / Company Name",
    form_phone: "Phone Number",
    form_service: "Service Required",
    form_opt_concrete: "Ready-Mix Concrete Supply",
    form_opt_piling: "Piling & Foundation Works",
    form_opt_civil: "General Civil Construction",
    form_opt_slab: "Concrete Slab / Industrial Flooring",
    form_opt_rental: "Machinery / Fleet Rental",
    form_location: "Project Location / Province",
    form_notes: "Project Scope & Details",
    form_submit: "Submit Tender / Quote Inquiry",
    contact_address_title: "Headquarters Address",
    contact_address_val: "Ang Village, Sangkat O’Char, Battambang City, Battambang Province, Cambodia",
    contact_phone_title: "Hotline Lines",
    contact_hours_title: "Operating Hours",
    contact_hours_val: "Monday - Sunday: 6:30 AM - 5:30 PM (24/7 Pouring on schedule)",
    contact_email_title: "Official Email",
    modal_details_title: "Project Specifications",
    modal_client: "Client / Owner:",
    modal_location: "Location:",
    modal_timeline: "Timeline:",
    modal_scope: "Scope of Work:",
    modal_close: "Close"
  },
  kh: {
    nav_home: "ទំព័រដើម",
    nav_about: "អំពីយើង",
    nav_services: "សេវាកម្មចម្បង",
    nav_fleet: "គ្រឿងចក្រ និងរថយន្ត",
    nav_coverage: "វិសាលភាពប្រតិបត្តិការ",
    nav_projects: "គម្រោងការងារ",
    nav_qa: "គុណភាព និងសុវត្ថិភាព",
    nav_clients: "ដៃគូសហការ",
    nav_contact: "ទំនាក់ទំនង",
    btn_request_quote: "ស្នើសុំតម្លៃ",
    btn_call_us: "ទូរស័ព្ទផ្ទាល់",
    hero_badge: "បទពិសោធន៍ជាង ៣០ ឆ្នាំក្នុងវិស័យវិស្វកម្ម និងសំណង់ (តាំងពីឆ្នាំ ១៩៩៥)",
    hero_title_1: "បេតុងគុណភាពខ្ពស់។",
    hero_title_2: "សំណង់គួរជាទីទុកចិត្ត។",
    hero_subtitle: "ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី (BCE) គឺជាក្រុមហ៊ុនឈានមុខគេក្នុងប្រទេសកម្ពុជា ផ្នែកផ្គត់ផ្គង់បេតុងលាយស្រេចដោយប្រព័ន្ធកុំព្យូទ័រ សេវាកម្មដាំគ្រឹះសសរស្ដម្ភ សំណង់ស៊ីវិល និងការជួលគ្រឿងចក្រធុនធ្ងន់។",
    btn_explore_projects: "មើលគម្រោងសម្រេចបាន",
    btn_calculate_concrete: "គណនាមាឌបេតុង",
    stat_experience_val: "៣០+",
    stat_experience_lbl: "ឆ្នាំនៃបទពិសោធន៍រឹងមាំ",
    stat_plants_val: "៤",
    stat_plants_lbl: "ស្ថានីយបេតុង (៧០ ម៉ែត្រគូប/ម៉ោង)",
    stat_trucks_val: "៤១",
    stat_trucks_lbl: "រថយន្តលាយបេតុង (បំពាក់ GPS)",
    stat_projects_val: "១២៨+",
    stat_projects_lbl: "គម្រោងធំៗសម្រេចបាន",
    stat_provinces_val: "១៤",
    stat_provinces_lbl: "ខេត្ត-ក្រុង និងរាជធានីភ្នំពេញ",
    about_tag: "ទិដ្ឋភាពទូទៅនៃក្រុមហ៊ុន",
    about_heading: "កសាងឧត្តមភាព។ ផ្តល់ទំនុកចិត្តយ៉ាងរឹងមាំទូទាំងប្រទេសកម្ពុជា។",
    about_p1: "ត្រូវបានបង្កើតឡើងដំបូងក្នុងឆ្នាំ ១៩៩៥ ក្រោមឈ្មោះក្រុមហ៊ុន ហុង ហួតលី ខូអិលធីឌី និងបានពង្រីកខ្លួនចុះបញ្ជីជាផ្លូវការនៅឆ្នាំ ២០២០ ជាក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី (BCE)។",
    about_p2: "ជាមួយនឹងស្ថានីយផលិតបេតុងស្វ័យប្រវត្តិកុំព្យូទ័រ រថយន្តលាយបេតុង ៤១ គ្រឿង រថយន្តបាញ់បេតុង ៨ គ្រឿង មន្ទីរពិសោធន៍ត្រួតពិនិត្យគុណភាពផ្ទាល់ខ្លួន និងក្រុមវិស្វករជំនាញ ១៥ រូប យើងធានាថារាល់សំណង់ជាមួយ BCE គឺរឹងមាំយូរអង្វែងតកូនចៅ។",
    chairwoman_title: "សាររបស់លោកស្រីប្រធានក្រុមប្រឹក្សាភិបាល",
    chairwoman_quote: "\"នៅ BCE គុណភាពមិនមែនត្រឹមតែជាតម្រូវការនោះទេ គឺជាគោលការណ៍ណែនាំប្រតិបត្តិការរបស់យើងទាំងអស់។ ចាប់ពីការជ្រើសរើសវត្ថុធាតុដើម រហូតដល់ការសាងសង់ យើងកសាងទំនុកចិត្ត សុវត្ថិភាព និងតម្លៃយូរអង្វែងសម្រាប់អនាគតកម្ពុជា។\"",
    chairwoman_name: "លោកស្រី ឡឿង ចាន់",
    chairwoman_role: "ប្រធានក្រុមប្រឹក្សាភិបាល ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង",
    values_title: "គុណតម្លៃស្នូលរបស់យើង",
    val_quality_title: "គុណភាពជាចម្បង",
    val_quality_desc: "អនុវត្តតាមស្តង់ដារអន្តរជាតិ ACI និងការពិសោធន៍យ៉ាងហ្មត់ចត់លើរាល់ម៉ែត្រគូបបេតុង។",
    val_safety_title: "សុវត្ថិភាពខ្ពស់បំផុត",
    val_safety_desc: "គោលការណ៍សុវត្ថិភាពការងារ និងបរិស្ថានយ៉ាងតឹងរ៉ឹងការពារបុគ្គលិក និងការដ្ឋាន។",
    val_integrity_title: "សុចរិតភាព និងទំនុកចិត្ត",
    val_integrity_desc: "តម្លាភាពក្នុងការធ្វើអាជីវកម្ម រូបមន្តលាយបេតុងត្រឹមត្រូវ និងការគោរពពាក្យសន្យា។",
    val_innovation_title: "បច្ចេកវិទ្យាទំនើប",
    val_innovation_desc: "ប្រព័ន្ធថ្លឹងស្វ័យប្រវត្តិកុំព្យូទ័រ ប្រព័ន្ធផ្កាយរណប GPS និងគ្រឿងចក្រធារាសាស្ត្រទំនើប។",
    val_teamwork_title: "ក្រុមការងារវិស្វកម្ម",
    val_teamwork_desc: "វិស្វករជំនាញ ១៥ រូប និងបុគ្គលិកបច្ចេកទេស ៧១ នាក់ ធានាការអនុវត្តការងារដោយរលូន។",
    val_sustain_title: "ការអភិវឌ្ឍប្រកបដោយចីរភាព",
    val_sustain_desc: "ការគ្រប់គ្រងកាកសំណល់ ការកែច្នៃទឹកប្រើប្រាស់ និងការកាត់បន្ថយការបំពុលបរិស្ថាន។",
    services_tag: "សេវាកម្មចម្បង",
    services_heading: "ដំណោះស្រាយសំណង់ស៊ីវិល និងបេតុងលាយស្រេចគ្រប់ជ្រុងជ្រោយ",
    srv_1_title: "ផ្គត់ផ្គង់បេតុងលាយស្រេច (Ready-Mix)",
    srv_1_desc: "ផលិតដោយប្រព័ន្ធកុំព្យូទ័រសមត្ថភាព ៧០ ម៉ែត្រគូប/ម៉ោង ក្នុងមួយស្ថានីយ។ កម្លាំងបេតុងចាប់ពី 15 MPa ដល់ 45 MPa និងការដឹកជញ្ជូនរហ័សទាន់ពេលវេលា។",
    srv_2_title: "សេវាកម្មបុក និងដាំសសរគ្រឹះបេតុង (Piling)",
    srv_2_desc: "គ្រឿងចក្របុកគ្រឹះធារាសាស្ត្រ និងការខួងគ្រឹះសសរស្ដម្ភទំនើប។ ផលិតសសរគ្រឹះបេតុងអាមេ ដឹកជញ្ជូន និងបុកដាំដោយវិស្វករជំនាញ។",
    srv_3_title: "សំណង់ស៊ីវិល និងរចនាសម្ព័ន្ធ (Civil Construction)",
    srv_3_desc: "សាងសង់អគារពាណិជ្ជកម្ម រោងចក្រឧស្សាហកម្ម ស្ពាន ទំនប់ទឹក ប្រឡាយមេ និងសំណង់បេតុងអាមេគ្រប់ប្រភេទ។",
    srv_4_title: "ការងារកម្រាលបេតុង (Concrete Slab Works)",
    srv_4_desc: "កម្រាលបេតុងឃ្លាំងទំនិញ ផ្លូវបេតុងទ្រទម្ងន់ធ្ងន់ កម្រាលអគារពាណិជ្ជកម្ម និងការខាត់រលោងដោយម៉ាស៊ីនទំនើប។",
    srv_5_title: "សេវាកម្មជួលគ្រឿងចក្រ និងរថយន្ត (Rental)",
    srv_5_desc: "ជួលរថយន្តបាញ់បេតុងដៃវែង រថយន្តលាយបេតុង ៧-១០ ម៉ែត្រគូប គ្រឿងចក្រស្ទូច និងគ្រឿងចក្របុកគ្រឹះ។",
    fleet_tag: "កងគ្រឿងចក្រ និងឧបករណ៍បច្ចេកវិទ្យា",
    fleet_heading: "កងគ្រឿងចក្រទំនើប និងស្ថានីយផលិតកម្មផ្ទាល់ខ្លួន",
    fleet_desc: "BCE ជាម្ចាស់កងគ្រឿងចក្រធុនធ្ងន់ដ៏ធំបំផុតមួយនៅភូមិភាគពាយ័ព្យនៃប្រទេសកម្ពុជា។",
    fleet_plant: "ស្ថានីយបេតុងស្វ័យប្រវត្តិ",
    fleet_plant_spec: "៤ ស្ថានីយ • សមត្ថភាព ៧០ ម៉ែត្រគូប/ម៉ោងក្នុងមួយស្ថានីយ • ប្រព័ន្ធថ្លឹងស្វ័យប្រវត្តិកុំព្យូទ័រ",
    fleet_mixers: "រថយន្តដឹក និងលាយបេតុង",
    fleet_mixers_spec: "៤១ គ្រឿង • ចំណុះ ៧ ទៅ ១០ ម៉ែត្រគូប • បំពាក់ប្រព័ន្ធតាមដាន GPS ២៤ម៉ោង",
    fleet_pumps: "រថយន្តបាញ់បេតុង (Pump Trucks)",
    fleet_pumps_spec: "៨ គ្រឿង • ប្រវែងដៃបាញ់ខ្ពស់ និងឆ្ងាយសម្រាប់អគារខ្ពស់ និងស្ពាន",
    fleet_piling: "គ្រឿងចក្របុក និងដាំសសរគ្រឹះ",
    fleet_piling_spec: "៧ គ្រឿង • ម៉ាស៊ីនបុកគ្រឹះធារាសាស្ត្រកម្លាំងខ្លាំងសម្រាប់ដីរឹង និងគម្រោងសូឡា",
    fleet_cranes: "រថយន្តស្ទូច និងរថយន្តសណ្តោង",
    fleet_cranes_spec: "៦ គ្រឿងស្ទូចចល័ត + ៨ អគារស្ទូច (Tower Cranes) សម្រាប់អគារខ្ពស់",
    fleet_lab: "មន្ទីរពិសោធន៍គុណភាពស្តង់ដារ",
    fleet_lab_spec: "ម៉ាស៊ីនសង្កត់បេតុង DYE-2000, ឧបករណ៍វាស់កម្រិតស្រុត Slump Test និងតេស្តដែក",
    coverage_tag: "វិសាលភាពប្រតិបត្តិការ",
    coverage_heading: "យើងទៅដល់គ្រប់ទីកន្លែងដែលលោកអ្នកសាងសង់ — ១៤ ខេត្ត-រាជធានី",
    coverage_desc: "ទីស្នាក់ការកណ្តាលស្ថិតនៅក្រុងបាត់ដំបង ជាមួយនឹងសមត្ថភាពចល័តស្ថានីយបេតុង និងដឹកជញ្ជូនរហ័សទូទាំងកម្ពុជា។",
    map_hq_label: "ទីស្នាក់ការកណ្តាល និងស្ថានីយមេ",
    map_hq_val: "ក្រុងបាត់ដំបង (សង្កាត់អូរចារ)",
    map_active_label: "បណ្តាញខេត្តប្រតិបត្តិការ BCE",
    map_active_provinces: "បាត់ដំបង, ភ្នំពេញ, បន្ទាយមានជ័យ, ប៉ៃលិន, ពោធិ៍សាត់, កំពង់ឆ្នាំង, កោះកុង, ព្រះសីហនុ, កណ្តាល, កំពង់ធំ, សៀមរាប, ឧត្តរមានជ័យ, ព្រះវិហារ, ស្ទឹងត្រែង។",
    projects_tag: "ស្នាដៃ និងបទពិសោធន៍ជាក់ស្តែង",
    projects_heading: "កាតាឡុកគម្រោងការងារលេចធ្លោ (ជាង ៣០ គម្រោង)",
    filter_all: "គម្រោងទាំងអស់ (៣០)",
    filter_buildings: "អគារខ្ពស់ និងពាណិជ្ជកម្ម",
    filter_infrastructure: "ផ្លូវ ស្ពាន ទំនប់ទឹក",
    filter_industrial: "រោងចក្រ និងសូឡា",
    filter_piling: "គ្រឹះសសរស្ដម្ភ",
    calc_tag: "ឧបករណ៍ជំនួយឆ្លាតវៃ",
    calc_heading: "ឧបករណ៍គណនាមាឌបេតុងលាយស្រេច",
    calc_desc: "រៀបចំផែនការតម្រូវការបេតុងយ៉ាងច្បាស់លាស់។ សូមបញ្ចូលវិមាត្រនៃសំណង់ដើម្បីប៉ាន់ប្រមាណមាឌបេតុង (ម៉ែត្រគូប m³) និងស្នើសុំតម្លៃតាម Telegram ភ្លាមៗ។",
    calc_shape_slab: "កម្រាលប្លង់សេ / ផ្លូវបេតុង",
    calc_shape_footing: "គ្រឹះទោល / ជើងតាង",
    calc_shape_column: "សសររាងបួនជ្រុង / ធ្នឹម",
    calc_dim_l: "បណ្តោយ (ម៉ែត្រ)",
    calc_dim_w: "ទទឹង (ម៉ែត្រ)",
    calc_dim_t: "កម្រាស់ ឬកម្ពស់ (ម៉ែត្រ)",
    calc_grade: "កម្លាំងបេតុងដែលត្រូវការ (ACI 211.1)",
    calc_btn: "គណនាមាឌបេតុង",
    calc_res_volume: "មាឌបេតុងជាក់ស្តែង៖",
    calc_res_order: "មាឌបេតុងដែលគួរកុម្ម៉ង់ (+៥% សុវត្ថិភាព)៖",
    calc_btn_quote: "កុម្ម៉ង់បេតុងចំនួននេះតាម Telegram @thendLP",
    qa_tag: "ស្តង់ដារគុណភាព និងសុវត្ថិភាព",
    qa_heading: "ការធានាគុណភាពមន្ទីរពិសោធន៍ និងការប្តេជ្ញាចិត្ត HSE",
    qa_desc: "នៅ BCE រាល់ការផលិតឆ្លងកាត់ដំណាក់កាលត្រួតពិនិត្យ ៥ ជំហានស្របតាមក្រសួងសាធារណការ និងដឹកជញ្ជូន។",
    qa_step_1: "១. ត្រួតពិនិត្យវត្ថុធាតុដើម",
    qa_step_1_desc: "តេស្តខ្សាច់ ថ្ម គុណភាពទឹក និងពិនិត្យលិខិតបញ្ជាក់គុណភាពស៊ីម៉ងត៍ពីរោងចក្រ។",
    qa_step_2: "២. ការគ្រប់គ្រងផលិតកម្ម",
    qa_step_2_desc: "ប្រព័ន្ធថ្លឹងអេឡិចត្រូនិចស្វ័យប្រវត្តិដែលមានវិញ្ញាបនបត្រក្រិតខ្នាតត្រឹមត្រូវ។",
    qa_step_3: "៣. តេស្តបេតុងស្រស់នៅការដ្ឋាន",
    qa_step_3_desc: "តេស្តកម្រិតស្រុត Slump Test និងការច្រកគំរូនាំយកមកមន្ទីរពិសោធន៍។",
    qa_step_4: "៤. តេស្តកម្លាំងសង្កត់",
    qa_step_4_desc: "តេស្តកម្លាំងសង្កត់អាយុ ៧ ថ្ងៃ និង ២៨ ថ្ងៃ ដោយម៉ាស៊ីន DYE-2000 ដែលមានលិខិតបញ្ជាក់។",
    qa_step_5: "៥. វិញ្ញាបនបត្របញ្ជាក់គុណភាព",
    qa_step_5_desc: "ចេញរបាយការណ៍លទ្ធផលតេស្តជាផ្លូវការជូនដល់វិស្វករត្រួតពិនិត្យរបស់ម្ចាស់គម្រោង។",
    partners_tag: "បណ្តាញដៃគូយុទ្ធសាស្ត្រ",
    partners_heading: "ទំនុកចិត្តពីក្រសួង ស្ថាប័នរដ្ឋ ក្រុមហ៊ុនសំណង់អន្តរជាតិ និងអ្នកផ្គត់ផ្គង់ធំៗ",
    contact_tag: "រួមគ្នាកសាងអនាគត",
    contact_heading: "ទំនាក់ទំនងមកកាន់ក្រុមហ៊ុន BCE ឥឡូវនេះ",
    contact_desc: "ត្រៀមចាប់ផ្តើមគម្រោងសំណង់ថ្មី ឬត្រូវការផ្គត់ផ្គង់បេតុងលាយស្រេច? ក្រុមវិស្វកររបស់យើងរង់ចាំផ្តល់ប្រឹក្សា និងតម្លៃពិសេស។",
    form_name: "ឈ្មោះពេញ / ឈ្មោះក្រុមហ៊ុន",
    form_phone: "លេខទូរស័ព្ទ",
    form_service: "សេវាកម្មដែលត្រូវការ",
    form_opt_concrete: "ផ្គត់ផ្គង់បេតុងលាយស្រេច (Ready-Mix)",
    form_opt_piling: "សេវាកម្មបុក និងដាំសសរគ្រឹះ (Piling)",
    form_opt_civil: "សំណង់ស៊ីវិលទូទៅ (Civil Construction)",
    form_opt_slab: "កម្រាលបេតុង និងផ្លូវបេតុង (Slab Works)",
    form_opt_rental: "ជួលគ្រឿងចក្រ និងរថយន្តបាញ់បេតុង",
    form_location: "ទីតាំងគម្រោង / ខេត្ត",
    form_notes: "ព័ត៌មានលម្អិតនៃគម្រោង",
    form_submit: "ផ្ញើសំណើសុំតម្លៃ / ព័ត៌មានគម្រោង",
    contact_address_title: "អាសយដ្ឋានទីស្នាក់ការកណ្តាល",
    contact_address_val: "ភូមិអង់ សង្កាត់អូរចារ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង ព្រះរាជាណាចក្រកម្ពុជា",
    contact_phone_title: "លេខទូរស័ព្ទទំនាក់ទំនង",
    contact_hours_title: "ម៉ោងធ្វើការ",
    contact_hours_val: "ច័ន្ទ - អាទិត្យ៖ ៦:៣០ ព្រឹក ដល់ ៥:៣០ ល្ងាច (ចាក់បេតុង ២៤ម៉ោងតាមកាលវិភាគ)",
    contact_email_title: "អ៊ីមែលផ្លូវការ",
    modal_details_title: "ព័ត៌មានលម្អិតនៃគម្រោង",
    modal_client: "ម្ចាស់គម្រោង៖",
    modal_location: "ទីតាំង៖",
    modal_timeline: "កាលបរិច្ឆេទ៖",
    modal_scope: "ទំហំការងារ៖",
    modal_close: "បិទផ្ទាំង"
  }
};

let currentLang = 'en';

// Set active language
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  
  // Update translation elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update button states
  const btnEn = document.getElementById('lang-btn-en');
  const btnKh = document.getElementById('lang-btn-kh');
  if (btnEn && btnKh) {
    if (lang === 'en') {
      btnEn.className = "px-3 py-1 text-xs font-bold rounded-md bg-amber-500 text-slate-900 shadow-sm transition";
      btnKh.className = "px-3 py-1 text-xs font-bold rounded-md text-white/80 hover:text-white transition";
    } else {
      btnKh.className = "px-3 py-1 text-xs font-bold rounded-md bg-amber-500 text-slate-900 shadow-sm transition";
      btnEn.className = "px-3 py-1 text-xs font-bold rounded-md text-white/80 hover:text-white transition";
    }
  }

  // Re-render project cards to reflect language
  renderProjects(currentFilter);
}

// 3. Render Projects Grid
let currentFilter = 'all';

function renderProjects(filter = 'all') {
  currentFilter = filter;
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  container.innerHTML = filtered.map(p => {
    const title = currentLang === 'kh' ? p.titleKh : p.titleEn;
    const cat = currentLang === 'kh' ? p.categoryKh : p.categoryEn;
    const client = currentLang === 'kh' ? p.clientKh : p.clientEn;
    const loc = currentLang === 'kh' ? p.locationKh : p.locationEn;
    const scope = currentLang === 'kh' ? p.scopeKh : p.scopeEn;

    return `
      <div class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-200/80 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
        <div class="relative h-56 bg-slate-100 overflow-hidden cursor-pointer" onclick="openProjectModal(${p.id})">
          <img src="${p.image}" alt="${title}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <span class="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full bg-slate-900/80 text-amber-400 backdrop-blur-md border border-amber-400/30">
            ${p.period}
          </span>
          <span class="absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-900/90 text-white backdrop-blur-md">
            ${cat}
          </span>
        </div>
        
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1 mb-2">
              ${title}
            </h3>
            <p class="text-xs text-slate-500 flex items-center gap-1.5 mb-3 font-medium">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
              ${loc}
            </p>
            <div class="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p><span class="font-semibold text-slate-800">${currentLang === 'kh' ? 'ម្ចាស់គម្រោង៖' : 'Owner:'}</span> ${client}</p>
              <p class="line-clamp-2"><span class="font-semibold text-slate-800">${currentLang === 'kh' ? 'ការងារ៖' : 'Scope:'}</span> ${scope}</p>
            </div>
          </div>
          
          <button onclick="openProjectModal(${p.id})" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800 flex items-center justify-center gap-2 transition-all">
            <span>${currentLang === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View Specifications'}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const f = btn.getAttribute('data-filter');
    if (f === filter) {
      btn.className = "filter-btn px-5 py-2.5 rounded-full text-xs font-bold bg-blue-900 text-white shadow-md shadow-blue-900/20 transition-all";
    } else {
      btn.className = "filter-btn px-5 py-2.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all";
    }
  });
}

// 4. Project Modal
function openProjectModal(id) {
  const p = projectsData.find(item => item.id === id);
  if (!p) return;

  const modal = document.getElementById('project-modal');
  const title = currentLang === 'kh' ? p.titleKh : p.titleEn;
  const cat = currentLang === 'kh' ? p.categoryKh : p.categoryEn;
  const client = currentLang === 'kh' ? p.clientKh : p.clientEn;
  const loc = currentLang === 'kh' ? p.locationKh : p.locationEn;
  const scope = currentLang === 'kh' ? p.scopeKh : p.scopeEn;

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-category').textContent = cat;
  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-client').textContent = client;
  document.getElementById('modal-location').textContent = loc;
  document.getElementById('modal-timeline').textContent = p.period;
  document.getElementById('modal-scope').textContent = scope;

  // Direct Inquiry Button in Modal
  const orderMsg = encodeURIComponent(`Hello BCE! I am interested in technical details or requesting a quote for project profile similar to: ${p.titleEn} (${p.locationEn}).`);
  const telegramBtn = document.getElementById('modal-telegram-btn');
  if (telegramBtn) {
    telegramBtn.href = `https://t.me/thendLP?text=${orderMsg}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// 5. Signature Projects Carousel
let carouselIndex = 0;
const signatureProjects = projectsData.filter(p => p.signature);

function renderCarousel() {
  const container = document.getElementById('carousel-track');
  if (!container) return;

  container.innerHTML = signatureProjects.map((p, idx) => {
    const title = currentLang === 'kh' ? p.titleKh : p.titleEn;
    const cat = currentLang === 'kh' ? p.categoryKh : p.categoryEn;
    const loc = currentLang === 'kh' ? p.locationKh : p.locationEn;

    return `
      <div class="min-w-full relative h-[420px] rounded-3xl overflow-hidden group cursor-pointer shadow-xl" onclick="openProjectModal(${p.id})">
        <img src="${p.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="max-w-xl">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-900 mb-3">
              ${cat} • ${p.period}
            </span>
            <h4 class="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
              ${title}
            </h4>
            <p class="text-sm text-slate-200 flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-amber-400"></i>
              ${loc}
            </p>
          </div>
          <div class="shrink-0">
            <button class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 flex items-center gap-2 shadow-lg transition">
              <span>${currentLang === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View Full Details'}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateCarouselDots();
  if (window.lucide) window.lucide.createIcons();
}

function updateCarouselDots() {
  const dotsContainer = document.getElementById('carousel-dots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = signatureProjects.map((_, i) => `
    <button onclick="goToSlide(${i})" class="w-3 h-3 rounded-full transition-all ${i === carouselIndex ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/70'}"></button>
  `).join('');
}

function nextSlide() {
  carouselIndex = (carouselIndex + 1) % signatureProjects.length;
  applySlide();
}

function prevSlide() {
  carouselIndex = (carouselIndex - 1 + signatureProjects.length) % signatureProjects.length;
  applySlide();
}

function goToSlide(i) {
  carouselIndex = i;
  applySlide();
}

function applySlide() {
  const track = document.getElementById('carousel-track');
  if (track) {
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
  }
  updateCarouselDots();
}

// 6. Interactive Ready-Mix Concrete Volume Calculator
function calculateConcrete() {
  const shape = document.getElementById('calc-shape').value;
  const l = parseFloat(document.getElementById('calc-length').value) || 0;
  const w = parseFloat(document.getElementById('calc-width').value) || 0;
  const t = parseFloat(document.getElementById('calc-thickness').value) || 0;
  const grade = document.getElementById('calc-grade').value;

  let netVol = 0;
  if (shape === 'slab' || shape === 'footing' || shape === 'column') {
    netVol = l * w * t;
  }

  // Round to 2 decimal places
  const netRounded = Math.max(0, netVol).toFixed(2);
  const orderRounded = (netVol * 1.05).toFixed(2); // 5% standard safety / waste margin

  document.getElementById('calc-net-vol').textContent = `${netRounded} m³`;
  document.getElementById('calc-order-vol').textContent = `${orderRounded} m³`;

  // Update Telegram RFQ button
  const shapeName = shape.toUpperCase();
  const telegramMsg = encodeURIComponent(
    `Hello BCE Construction! I calculated concrete on your website:\n- Structure: ${shapeName}\n- Dimensions: ${l}m x ${w}m x ${t}m\n- Required Volume: ${orderRounded} m³ (with 5% buffer)\n- Target Grade: ${grade}\nPlease send me the official quotation and batching delivery schedule.`
  );
  
  const quoteBtn = document.getElementById('calc-telegram-quote');
  if (quoteBtn) {
    quoteBtn.href = `https://t.me/thendLP?text=${telegramMsg}`;
    quoteBtn.classList.remove('hidden');
  }
}

// 7. Interactive Cambodia Province Selection
const provinceData = {
  "battambang": {
    nameEn: "Battambang (Headquarters & Central Batching Plants)",
    nameKh: "បាត់ដំបង (ទីស្នាក់ការកណ្តាល និងស្ថានីយបេតុងមេ)",
    descEn: "Core BCE operations with 4 automated batching plants (70 m³/hr each), primary 41 mixer truck depot, hydraulic piling equipment, and central certified testing laboratory.",
    descKh: "ទីស្នាក់ការកណ្តាល BCE បំពាក់ស្ថានីយបេតុង ៤ កន្លែង រថយន្តលាយបេតុង ៤១ គ្រឿង គ្រឿងចក្របុកគ្រឹះ និងមន្ទីរពិសោធន៍គុណភាព។",
    projects: "60+ Major Projects (Hotels, Schools, Hospitals, Roads & Bridges)",
    flagship: "Sala Ta On Dam, Prek Trap Bridge, Polyclinic Building, Conch Cement Factory"
  },
  "phnom_penh": {
    nameEn: "Phnom Penh Capital",
    nameKh: "រាជធានីភ្នំពេញ",
    descEn: "Strategic delivery coverage for government institutional developments, academic complexes, and multi-apartment projects.",
    descKh: "ការផ្គត់ផ្គង់ និងសាងសង់សម្រាប់ស្ថាប័នរដ្ឋាភិបាល អគារសិក្សា និងលំនៅឋានពហុជាន់។",
    projects: "15+ High-Rise & Institutional Works",
    flagship: "Ministry of Interior (MoI) NASLA Academic Complex & Dormitory"
  },
  "banteay_meanchey": {
    nameEn: "Banteay Meanchey & Poipet City",
    nameKh: "បន្ទាយមានជ័យ និងក្រុងប៉ោយប៉ែត",
    descEn: "High-volume ready-mix supply and structural concrete construction for high-rise commercial buildings, border infrastructure, and universities.",
    descKh: "ការផ្គត់ផ្គង់បេតុងលាយស្រេច និងសាងសង់អគារខ្ពស់ៗ ហេដ្ឋារចនាសម្ព័ន្ធព្រំដែន និងសាកលវិទ្យាល័យ។",
    projects: "25+ Major High-Rise & Institutional Projects",
    flagship: "18-Floor Poipet Residential Tower, 11-Floor Building, Build Bright University (BBU)"
  },
  "pursat": {
    nameEn: "Pursat Province",
    nameKh: "ខេត្តពោធិ៍សាត់",
    descEn: "Heavy hydraulic piling and large-scale concrete foundations for renewable solar energy power plants and infrastructure.",
    descKh: "ការបុក និងដាំសសរគ្រឹះបេតុងធារាសាស្ត្រសម្រាប់រោងចក្រថាមពលពន្លឺព្រះអាទិត្យខ្នាតធំ។",
    projects: "Key Clean Energy Infrastructure",
    flagship: "Schneitec 100 MW Solar Power Plant Piling Works"
  },
  "koh_kong": {
    nameEn: "Koh Kong Province",
    nameKh: "ខេត្តកោះកុង",
    descEn: "Specialized maritime concrete works, coastal access roads, and deep-water port infrastructure.",
    descKh: "ការងារបេតុងធន់ទឹកប្រៃ ផ្លូវឆ្នេរសមុទ្រ និងហេដ្ឋារចនាសម្ព័ន្ធកំពង់ផែ។",
    projects: "Deep Port & Marine Facilities",
    flagship: "Chroy Pros Sea Port Infrastructure (Samdech Pichey Sena Tea Banh)"
  },
  "preah_vihear": {
    nameEn: "Preah Vihear Province",
    nameKh: "ខេត្តព្រះវិហារ",
    descEn: "Long-range concrete deployment for national security highways, concrete canal rehabilitation, and rural hydraulic subprojects.",
    descKh: "ការសាងសង់ផ្លូវជាតិយុទ្ធសាស្ត្រ និងប្រព័ន្ធធារាសាស្ត្រប្រឡាយមេ។",
    projects: "National Infrastructure & Canal Works",
    flagship: "Teuk Krahom Canal Subprojects (MOWRAM), Mum 3 Concrete Road (MND)"
  }
};

function selectProvince(key) {
  const p = provinceData[key];
  if (!p) return;

  const titleEl = document.getElementById('province-title');
  const descEl = document.getElementById('province-desc');
  const projEl = document.getElementById('province-projects');
  const flagEl = document.getElementById('province-flagship');

  if (titleEl) titleEl.textContent = currentLang === 'kh' ? p.nameKh : p.nameEn;
  if (descEl) descEl.textContent = currentLang === 'kh' ? p.descKh : p.descEn;
  if (projEl) projEl.textContent = p.projects;
  if (flagEl) flagEl.textContent = p.flagship;

  // Update active pill
  document.querySelectorAll('.province-pill').forEach(pill => {
    if (pill.getAttribute('data-prov') === key) {
      pill.className = "province-pill px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-900 shadow-md transition-all";
    } else {
      pill.className = "province-pill px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all";
    }
  });
}

// 8. Contact Form Submission
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('form-name').value;
  const phone = document.getElementById('form-phone').value;
  const service = document.getElementById('form-service').value;
  const location = document.getElementById('form-location').value;
  const notes = document.getElementById('form-notes').value;

  const msg = encodeURIComponent(`BCE Tender Inquiry:\n- Client: ${name}\n- Phone: ${phone}\n- Service: ${service}\n- Location: ${location}\n- Notes: ${notes}`);
  
  // Provide user immediate direct telegram option or show toast
  window.open(`https://t.me/thendLP?text=${msg}`, '_blank');

  alert(currentLang === 'kh' 
    ? "សូមអរគុណ! សំណើសុំតម្លៃរបស់អ្នកត្រូវបានទទួលជោគជ័យ។ ក្រុមការងារយើងនឹងទាក់ទងមកលោកអ្នកក្នុងពេលឆាប់ៗ។" 
    : "Thank you! Your inquiry has been forwarded to BCE. Our engineering team will contact you shortly.");
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');
  renderCarousel();
  selectProvince('battambang');

  // Automatic carousel slide interval
  setInterval(nextSlide, 6500);

  // Keyboard escape for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
