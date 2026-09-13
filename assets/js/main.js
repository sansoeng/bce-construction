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

// 2. Comprehensive Bilingual Architectural Dictionary
const translations = {
  en: {
    // Top Bar & Meta
    meta_status: "BATCH PLANTS: OPERATIONAL",
    meta_coords: "13.0957° N, 103.2022° E (BATTAMBANG HQ)",
    meta_hotline: "HOTLINE: 012 932 700 / 017 222 205",
    meta_hours: "24/7 SITE POURING DISPATCH",

    // Navigation
    nav_studio: "The Studio",
    nav_principles: "Principles",
    nav_protocol: "QA Protocol",
    nav_fleet: "Fleet & Assets",
    nav_estimator: "Estimator",
    nav_works: "Selected Works",
    nav_brief: "Tender Brief",
    nav_contact: "Contact",
    btn_dispatch_telegram: "Dispatch Telegram",

    // Hero Section
    hero_meta_tag: "EST. 1995 • ACI 211.1 CERTIFIED • BATTAMBANG & 14 PROVINCES",
    hero_headline_1: "Engineering Permanence.",
    hero_headline_2: "Precision Ready-Mix & Piling Infrastructure.",
    hero_description: "Battambang Construction and Engineering (BCE) operates 4 computerized batching plants, an active GPS fleet of 41 transit mixers, hydraulic piling rigs, and an in-house certified testing laboratory, delivering enduring structural confidence across Cambodia.",
    hero_cta_estimator: "Launch Volumetric Estimator",
    hero_cta_works: "Explore Selected Works",
    stat_experience: "Years Proven Track Record",
    stat_plants: "Automated Batching Plants (70 m³/hr)",
    stat_fleet: "GPS Transit Mixers (7–10 m³)",
    stat_projects: "Landmark Structures Delivered",

    // Section 01: The Studio & Leadership
    s01_tag: "01 / THE STUDIO & HERITAGE",
    s01_title: "Thirty Years of Material Discipline in Northwestern Cambodia.",
    s01_p1: "Founded in 1995 under Hong Huot Ly Co., Ltd. and restructured in 2020 as Battambang Construction and Engineering Co., Ltd. (BCE), our studio has anchored the physical modernization of Cambodia for over three decades.",
    s01_p2: "Under the executive leadership of Chairwoman Ms. Loeung Chan, BCE pairs heavy industrial machinery with rigorous material sciences. With 15 licensed civil engineers and 71 specialized technical operators, we bridge the gap between architectural vision and generational structural permanence.",
    chairwoman_quote: "“At BCE, concrete is not merely a commodity—it is the foundation of national progress. Every cubic meter dispatched carries our unyielding commitment to structural integrity, mathematical accuracy, and enduring safety.”",
    chairwoman_name: "Ms. Loeung Chan",
    chairwoman_title: "Chairwoman & Founder, BCE Co., Ltd.",

    // Section 02: Principles
    s02_tag: "02 / ARCHITECTURAL PRINCIPLES",
    s02_title: "Engineering Integrity by First Principles.",
    p1_title: "Material Honesty",
    p1_desc: "Strictly washed quartz aggregates, calibrated river sand, and high-performance Portland cement verified by in-house laboratory sieve analysis.",
    p2_title: "Batching Precision",
    p2_desc: "Automated digital weighing systems with continuous moisture sensor compensation, guaranteeing mix tolerances within ±1% across all grades.",
    p3_title: "Logistical Certainty",
    p3_desc: "Real-time GPS telemetry tracking across 41 transit mixers ensures synchronized site arrival, preventing cold joints during continuous deep pours.",
    p4_title: "Generational Strength",
    p4_desc: "Complete laboratory testing from initial slump verification to 7-day and 28-day compressive crushing using our calibrated DYE-2000 machine.",

    // Section 03: 5-Stage Protocol
    s03_tag: "03 / PRODUCTION & QA PROTOCOL",
    s03_title: "Five-Stage Quality Assurance Protocol.",
    s03_desc: "Every cubic meter follows an unbroken chain of custody certified in compliance with ACI 211.1, ASTM standards, and the Ministry of Public Works and Transport.",
    stage_1_num: "STAGE 01",
    stage_1_title: "Aggregate & Material Verification",
    stage_1_desc: "Comprehensive sieve analysis, specific gravity testing, water chemical neutrality (pH) checks, and supplier mill test validation.",
    stage_2_num: "STAGE 02",
    stage_2_title: "Computerized Batch Formulation",
    stage_2_desc: "Automated moisture-compensated batching with precise chemical admixture introduction for slump retention up to 120 minutes.",
    stage_3_num: "STAGE 03",
    stage_3_title: "Transit & Slump Control",
    stage_3_desc: "GPS route optimization and on-site slump cone testing (80mm to 180mm tolerance) conducted prior to placement discharge.",
    stage_4_num: "STAGE 04",
    stage_4_title: "Hydraulic Pumping & Pouring",
    stage_4_desc: "High-volume placement through our fleet of 8 extended boom pumps (up to 48m reach) with continuous mechanical compaction.",
    stage_5_num: "STAGE 05",
    stage_5_title: "Compressive Crushing Certification",
    stage_5_desc: "Standard cylinder casting, water bath curing, and calibrated hydraulic crushing on our DYE-2000 machine with formal client reports.",

    // Section 04: Machinery & Fleet
    s04_tag: "04 / PRODUCTION ASSETS & FLEET",
    s04_title: "Owned Heavy Machinery Fleet & Batching Logistics.",
    asset_1_title: "Computerized Batching Plants",
    asset_1_spec: "4 automated plants • 70 m³/hr individual capacity • 2,800 m³/day combined output",
    asset_2_title: "GPS Concrete Transit Mixers",
    asset_2_spec: "41 heavy transit mixers • 7 to 10 m³ payload • Real-time dispatch telemetry",
    asset_3_title: "Concrete Boom Pump Trucks",
    asset_3_spec: "8 extended boom units • 38m to 48m vertical reach • High-pressure line pumping",
    asset_4_title: "Hydraulic Piling Rigs",
    asset_4_spec: "7 heavy hydraulic piling rigs • Deep foundation driving for solar & high-rise civil works",
    asset_5_title: "Telescopic & Tower Cranes",
    asset_5_spec: "6 telescopic mobile crane trucks + 8 tower cranes for vertical structural erection",
    asset_6_title: "Certified Materials Laboratory",
    asset_6_spec: "DYE-2000 digital compressive testing machine, slump apparatus, aggregate sieve bank",

    // Section 05: Field Estimator
    s05_tag: "05 / FIELD VOLUMETRIC ESTIMATOR",
    s05_title: "Architectural Concrete Estimator Console.",
    s05_desc: "Calculate required structural volume, safety allowances, mixer truck fleet allocation, and generate a prefilled technical quotation via Telegram.",
    calc_preset_slab: "Slab / Pavement",
    calc_preset_footing: "Pad Footing",
    calc_preset_column: "Column / Beam",
    calc_preset_wall: "Retaining Wall",
    calc_lbl_length: "Length (Meters)",
    calc_lbl_width: "Width (Meters)",
    calc_lbl_thickness: "Thickness / Depth (Meters)",
    calc_lbl_grade: "Mix Strength Grade (ACI 211.1 / ASTM)",
    calc_res_net: "Net Volume",
    calc_res_order: "Recommended (+5% buffer)",
    calc_res_trucks: "Required Mixer Trips",
    calc_res_time: "Est. Batch Duration",
    calc_btn_quote: "Order This Volume via Telegram @thendLP",

    // Section 06: Selected Works
    s06_tag: "06 / SELECTED WORKS ARCHIVE",
    s06_title: "Portfolio of Structural & Civil Landmarks.",
    filter_all: "All Projects (30)",
    filter_buildings: "High-Rise & Commercial",
    filter_infrastructure: "Infrastructure & Civil",
    filter_industrial: "Industrial & Solar",
    filter_piling: "Piling & Foundations",
    inspect_specs: "Inspect Specifications",

    // Section 07: Spatial Brief / Inquiries
    s07_tag: "07 / SPATIAL BRIEF & TENDER INTAKE",
    s07_title: "Submit a Project Brief or Tender Inquiry.",
    s07_desc: "Modeled for consulting architects, developers, and lead structural contractors. Complete the preliminary brief below to initiate a direct dispatch quotation.",
    brief_f1_num: "01",
    brief_f1_label: "Client or Enterprise Name",
    brief_f1_ph: "e.g. Oknha Vong Duong / Sino-Cambodia Development Corp",
    brief_f2_num: "02",
    brief_f2_label: "Direct Telephone or Telegram Contact",
    brief_f2_ph: "e.g. +855 12 932 700 or @username",
    brief_f3_num: "03",
    brief_f3_label: "Project Typology & Core Service",
    brief_f3_opt1: "Ready-Mix Concrete Supply (Continuous Pour)",
    brief_f3_opt2: "Reinforced Concrete Piling & Foundation Driving",
    brief_f3_opt3: "Civil, Bridge & Marine Structural Construction",
    brief_f3_opt4: "Laser-Screeded Industrial Concrete Slab / Flooring",
    brief_f3_opt5: "Heavy Fleet & Pump Truck Rental",
    brief_f4_num: "04",
    brief_f4_label: "Site Location & Province in Cambodia",
    brief_f4_ph: "e.g. Poipet City, Banteay Meanchey or Battambang City",
    brief_f5_num: "05",
    brief_f5_label: "Estimated Volume & Target Strength",
    brief_f5_ph: "e.g. 1,200 m³ • Grade 35 MPa (5,000 PSI)",
    brief_f6_num: "06",
    brief_f6_label: "Project Scope & Execution Timeline",
    brief_f6_ph: "Outline key architectural schedules, site access conditions, and pour requirements...",
    brief_btn_submit: "Dispatch Spatial Brief to Telegram @thendLP",

    // Modal
    modal_spec_title: "TECHNICAL SPECIFICATION SHEET",
    modal_client_lbl: "Client / Developer:",
    modal_location_lbl: "Site Location:",
    modal_timeline_lbl: "Construction Period:",
    modal_scope_lbl: "Scope of Engineering Works:",
    modal_btn_inquire: "Inquire About Similar Specifications via Telegram @thendLP",
    modal_btn_close: "Close Blueprint",

    // Footer
    footer_tag: "BATTAMBANG CONSTRUCTION & ENGINEERING CO., LTD. (BCE)",
    footer_desc: "Operating 4 computerized batching plants, 41 transit mixers, 8 boom pumps, and 7 hydraulic piling drivers across 14 provinces in Cambodia. Licensed and certified by the Ministry of Public Works and Transport.",
    footer_address_title: "Headquarters & Central Plant",
    footer_address_val: "Ang Village, Sangkat O’Char, Battambang City, Battambang Province, Kingdom of Cambodia.",
    footer_hours_title: "Dispatch Desk & Operating Hours",
    footer_hours_val: "Monday – Sunday: 06:30 – 17:30 (24/7 Site Pouring Available upon Schedule)",
    footer_hotlines_title: "Direct Hotlines",
    footer_copyright: "© 2026 Battambang Construction & Engineering Co., Ltd. All rights reserved. Engineering Precision Built for Generational Permanence."
  },
  kh: {
    // Top Bar & Meta
    meta_status: "ស្ថានីយបេតុង៖ កំពុងដំណើរការ",
    meta_coords: "13.0957° N, 103.2022° E (ទីស្នាក់ការកណ្តាលបាត់ដំបង)",
    meta_hotline: "ខ្សែទូរស័ព្ទបន្ទាន់៖ 012 932 700 / 017 222 205",
    meta_hours: "សេវាចាក់បេតុង ២៤/៧ តាមកាលវិភាគ",

    // Navigation
    nav_studio: "ទិដ្ឋភាពទូទៅ",
    nav_principles: "គោលការណ៍",
    nav_protocol: "ស្តង់ដារគុណភាព",
    nav_fleet: "គ្រឿងចក្រ និងកងរថយន្ត",
    nav_estimator: "គណនាមាឌបេតុង",
    nav_works: "គម្រោងលេចធ្លោ",
    nav_brief: "ស្នើសុំតម្លៃ / កិច្ចសន្យា",
    nav_contact: "ទំនាក់ទំនង",
    btn_dispatch_telegram: "ទាក់ទងតាម Telegram",

    // Hero Section
    hero_meta_tag: "បទពិសោធន៍តាំងពីឆ្នាំ ១៩៩៥ • ស្តង់ដារ ACI 211.1 • បម្រើសេវាទូទាំង ១៤ ខេត្ត-រាជធានី",
    hero_headline_1: "វិស្វកម្មរឹងមាំយូរអង្វែង។",
    hero_headline_2: "បេតុងលាយស្រេច និងគ្រឹះសសរស្ដម្ភកម្រិតខ្ពស់។",
    hero_description: "ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី (BCE) គ្រប់គ្រងស្ថានីយផលិតបេតុងស្វ័យប្រវត្តិកុំព្យូទ័រចំនួន ៤ កន្លែង រថយន្តលាយបេតុង ៤១ គ្រឿង គ្រឿងចក្របុកគ្រឹះធារាសាស្ត្រ និងមន្ទីរពិសោធន៍គុណភាព ផ្តល់នូវទំនុកចិត្ត និងភាពរឹងមាំយូរអង្វែងតកូនចៅ។",
    hero_cta_estimator: "បើកផ្ទាំងគណនាមាឌបេតុង",
    hero_cta_works: "ពិនិត្យគម្រោងសម្រេចបាន",
    stat_experience: "ឆ្នាំនៃបទពិសោធន៍រឹងមាំក្នុងវិស័យសំណង់",
    stat_plants: "ស្ថានីយបេតុងស្វ័យប្រវត្តិ (៧០ m³/ម៉ោង)",
    stat_fleet: "រថយន្តដឹក និងលាយបេតុង GPS (៧-១០ m³)",
    stat_projects: "គម្រោងសំណង់ធំៗសម្រេចបាន",

    // Section 01: The Studio & Leadership
    s01_tag: "០១ / ទិដ្ឋភាពទូទៅ និងកេរ្តិ៍ដំណែល",
    s01_title: "បទពិសោធន៍ ៣០ ឆ្នាំនៃវិន័យផលិតកម្មនៅភូមិភាគពាយ័ព្យ។",
    s01_p1: "ត្រូវបានបង្កើតឡើងក្នុងឆ្នាំ ១៩៩៥ ក្រោមឈ្មោះក្រុមហ៊ុន ហុង ហួតលី ខូអិលធីឌី និងបានពង្រីកខ្លួនចុះបញ្ជីផ្លូវការជាក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី (BCE) ក្នុងឆ្នាំ ២០២០ ដោយបានចូលរួមចំណែកយ៉ាងសកម្មក្នុងការអភិវឌ្ឍហេដ្ឋារចនាសម្ព័ន្ធកម្ពុជាជាងបីទសវត្សរ៍។",
    s01_p2: "ក្រោមការដឹកនាំរបស់លោកស្រីប្រធានក្រុមប្រឹក្សាភិបាល ឡឿង ចាន់ ក្រុមហ៊ុន BCE រួមបញ្ចូលគ្នានូវគ្រឿងចក្រធុនធ្ងន់ទំនើប និងវិទ្យាសាស្ត្រសម្ភារៈសំណង់យ៉ាងហ្មត់ចត់។ ជាមួយវិស្វករជំនាញ ១៥ រូប និងបុគ្គលិកបច្ចេកទេស ៧១ រូប យើងធានាថារាល់សំណង់ដែលសាងសង់ជាមួយ BCE មានភាពរឹងមាំយូរអង្វែងជាអចិន្ត្រៃយ៍។",
    chairwoman_quote: "“នៅ BCE បេតុងមិនមែនគ្រាន់តែជាផលិតផលនោះទេ គឺជាគ្រឹះនៃការរីកចម្រើនរបស់ជាតិ។ រាល់ម៉ែត្រគូបដែលយើងបញ្ជូនចេញ សុទ្ធតែបង្កប់នូវការប្តេជ្ញាចិត្តខ្ពស់បំផុតចំពោះគុណភាព រូបមន្តគណនាត្រឹមត្រូវ និងសុវត្ថិភាពយូរអង្វែង។”",
    chairwoman_name: "លោកស្រី ឡឿង ចាន់",
    chairwoman_title: "ប្រធានក្រុមប្រឹក្សាភិបាល និងជាស្ថាបនិក BCE",

    // Section 02: Principles
    s02_tag: "០២ / គោលការណ៍វិស្វកម្ម",
    s02_title: "គុណភាព និងសុចរិតភាពផ្អែកលើវិទ្យាសាស្ត្រសំណង់។",
    p1_title: "ភាពស្មោះត្រង់នៃវត្ថុធាតុដើម",
    p1_desc: "ថ្មលាងស្អាត ខ្សាច់ទន្លេគ្មានជាតិភក់ និងស៊ីម៉ងត៍គុណភាពខ្ពស់ ដែលត្រូវបានត្រួតពិនិត្យតាមរយៈការរែងតេស្តយ៉ាងហ្មត់ចត់នៅក្នុងមន្ទីរពិសោធន៍។",
    p2_title: "ភាពជាក់លាក់នៃការលាយបេតុង",
    p2_desc: "ប្រព័ន្ធថ្លឹងស្វ័យប្រវត្តិកុំព្យូទ័រដែលមានប្រព័ន្ធវាស់សំណើមស្វ័យប្រវត្តិ ធានាកម្រិតលម្អៀងក្រោម ±១% លើគ្រប់កម្លាំងបេតុង។",
    p3_title: "ភាពច្បាស់លាស់ក្នុងការដឹកជញ្ជូន",
    p3_desc: "ប្រព័ន្ធផ្កាយរណប GPS លើរថយន្តលាយបេតុង ៤១ គ្រឿង ធានាការមកដល់ការដ្ឋានទាន់ពេល ចៀសវាងការស្ទះបេតុង និងស្នាមប្រេះកម្រាល។",
    p4_title: "ភាពរឹងមាំតកូនចៅ",
    p4_desc: "ការត្រួតពិនិត្យកម្រិតស្រុត Slump Test និងការសង្កត់បំបែកគំរូបេតុងអាយុ ៧ ថ្ងៃ និង ២៨ ថ្ងៃ ដោយម៉ាស៊ីន DYE-2000 ដែលមានវិញ្ញាបនបត្រត្រឹមត្រូវ។",

    // Section 03: 5-Stage Protocol
    s03_tag: "០៣ / ដំណាក់កាលផលិតកម្ម និងស្តង់ដារគុណភាព",
    s03_title: "ដំណាក់កាលត្រួតពិនិត្យគុណភាពទាំង ៥ ជំហាន។",
    s03_desc: "រាល់ម៉ែត្រគូបបេតុងឆ្លងកាត់ការត្រួតពិនិត្យយ៉ាងតឹងរ៉ឹង ស្របតាមស្តង់ដារអន្តរជាតិ ACI 211.1, ASTM និងក្រសួងសាធារណការ និងដឹកជញ្ជូន។",
    stage_1_num: "ជំហាន ០១",
    stage_1_title: "ត្រួតពិនិត្យ និងតេស្តវត្ថុធាតុដើម",
    stage_1_desc: "តេស្តរែងទំហំគ្រាប់ថ្ម និងខ្សាច់ ពិនិត្យកម្រិត pH នៃទឹក និងផ្ទៀងផ្ទាត់លិខិតបញ្ជាក់គុណភាពស៊ីម៉ងត៍ពីរោងចក្រ។",
    stage_2_num: "ជំហាន ០២",
    stage_2_title: "រូបមន្តផលិតដោយប្រព័ន្ធកុំព្យូទ័រ",
    stage_2_desc: "ប្រព័ន្ធថ្លឹងអេឡិចត្រូនិចស្វ័យប្រវត្តិ និងការលាយសារធាតុបន្ថែមគីមីដើម្បីរក្សាភាពស្រស់របស់បេតុងបានរហូតដល់ ១២០ នាទី។",
    stage_3_num: "ជំហាន ០៣",
    stage_3_title: "ការគ្រប់គ្រងដឹកជញ្ជូន និងកម្រិតស្រុត",
    stage_3_desc: "ការគ្រប់គ្រងផ្លូវដឹកជញ្ជូនតាម GPS និងការតេស្តកម្រិតស្រុត Slump Cone (៨០ ដល់ ១៨០ មម) ផ្ទាល់នៅការដ្ឋានមុនពេលចាក់។",
    stage_4_num: "ជំហាន ០៤",
    stage_4_title: "ការបាញ់ និងចាក់បេតុងធារាសាស្ត្រ",
    stage_4_desc: "រថយន្តបាញ់បេតុងដៃវែង ៨ គ្រឿង (ប្រវែងដល់ ៤៨ ម៉ែត្រ) និងការរំញ័រពង្រាបបេតុងដោយម៉ាស៊ីនយ៉ាងស្មើដៃ។",
    stage_5_num: "ជំហាន ០៥",
    stage_5_title: "វិញ្ញាបនបត្រតេស្តកម្លាំងសង្កត់",
    stage_5_desc: "ច្រកគំរូបេតុង ត្រាំទឹក និងសង្កត់តេស្តកម្លាំងដោយម៉ាស៊ីន DYE-2000 រួចចេញរបាយការណ៍បច្ចេកទេសផ្លូវការជូនម្ចាស់គម្រោង។",

    // Section 04: Machinery & Fleet
    s04_tag: "០៤ / កងគ្រឿងចក្រ និងស្ថានីយផលិតកម្ម",
    s04_title: "កងគ្រឿងចក្រធុនធ្ងន់ និងស្ថានីយបេតុងទំនើបកម្មសិទ្ធិផ្ទាល់ខ្លួន។",
    asset_1_title: "ស្ថានីយបេតុងស្វ័យប្រវត្តិកុំព្យូទ័រ",
    asset_1_spec: "៤ ស្ថានីយ • សមត្ថភាព ៧០ m³/ម៉ោងក្នុងមួយស្ថានីយ • ផលិតបាន ២,៨០០ m³/ថ្ងៃ",
    asset_2_title: "រថយន្តដឹក និងលាយបេតុង GPS",
    asset_2_spec: "៤១ គ្រឿង • ចំណុះ ៧ ទៅ ១០ m³ • ប្រព័ន្ធតាមដានផ្កាយរណប GPS ២៤ ម៉ោង",
    asset_3_title: "រថយន្តបាញ់បេតុងដៃវែង",
    asset_3_spec: "៨ គ្រឿង • ប្រវែងដៃបាញ់ ៣៨ ទៅ ៤៨ ម៉ែត្រ • សមត្ថភាពបាញ់សម្ពាធខ្ពស់",
    asset_4_title: "គ្រឿងចក្របុក និងដាំសសរគ្រឹះ",
    asset_4_spec: "៧ គ្រឿង • ម៉ាស៊ីនបុកគ្រឹះធារាសាស្ត្រសម្រាប់គម្រោងសូឡា និងអគារខ្ពស់",
    asset_5_title: "រថយន្តស្ទូច និងអគារស្ទូច",
    asset_5_spec: "៦ គ្រឿងស្ទូចចល័ត + ៨ អគារស្ទូច (Tower Cranes) សម្រាប់លើកសម្ភារៈអគារខ្ពស់",
    asset_6_title: "មន្ទីរពិសោធន៍គុណភាពស្តង់ដារ",
    asset_6_spec: "ម៉ាស៊ីនសង្កត់បេតុង DYE-2000, ឧបករណ៍វាស់កម្រិតស្រុត Slump Test និងតេស្តរែងថ្ម",

    // Section 05: Field Estimator
    s05_tag: "០៥ / ឧបករណ៍គណនាមាឌបេតុង",
    s05_title: "ផ្ទាំងគណនាមាឌបេតុង និងរៀបចំកងរថយន្ត។",
    s05_desc: "គណនាមាឌបេតុងសម្រាប់សំណង់ បរិមាណបម្រុងទុក ចំនួនជើងរថយន្តលាយបេតុង និងបង្កើតសំណើសុំតម្លៃតាម Telegram ដោយស្វ័យប្រវត្តិ។",
    calc_preset_slab: "កម្រាលប្លង់សេ / ផ្លូវ",
    calc_preset_footing: "គ្រឹះជើងតាង",
    calc_preset_column: "សសរ / ធ្នឹម",
    calc_preset_wall: "ជញ្ជាំងបេតុងទប់ដី",
    calc_lbl_length: "បណ្តោយ (ម៉ែត្រ)",
    calc_lbl_width: "ទទឹង (ម៉ែត្រ)",
    calc_lbl_thickness: "កម្រាស់ ឬកម្ពស់ (ម៉ែត្រ)",
    calc_lbl_grade: "កម្លាំងបេតុងដែលត្រូវការ (ACI 211.1 / ASTM)",
    calc_res_net: "មាឌបេតុងជាក់ស្តែង",
    calc_res_order: "មាឌគួរកុម្ម៉ង់ (+៥% សុវត្ថិភាព)",
    calc_res_trucks: "ចំនួនជើងរថយន្តលាយ",
    calc_res_time: "រយៈពេលផលិតប៉ាន់ស្មាន",
    calc_btn_quote: "កុម្ម៉ង់បេតុងបរិមាណនេះតាម Telegram @thendLP",

    // Section 06: Selected Works
    s06_tag: "០៦ / បណ្ណាល័យគម្រោងការងារ",
    s06_title: "កាតាឡុកគម្រោងសំណង់ និងហេដ្ឋារចនាសម្ព័ន្ធលេចធ្លោ។",
    filter_all: "គម្រោងទាំងអស់ (៣០)",
    filter_buildings: "អគារខ្ពស់ និងពាណិជ្ជកម្ម",
    filter_infrastructure: "ហេដ្ឋារចនាសម្ព័ន្ធ និងផ្លូវស្ពាន",
    filter_industrial: "រោងចក្រ និងសូឡា",
    filter_piling: "គ្រឹះសសរស្ដម្ភ",
    inspect_specs: "ពិនិត្យទិន្នន័យបច្ចេកទេស",

    // Section 07: Spatial Brief / Inquiries
    s07_tag: "០៧ / សំណើសុំតម្លៃ និងព័ត៌មានគម្រោង",
    s07_title: "ដាក់ស្នើព័ត៌មានគម្រោង ឬដេញថ្លៃផ្គត់ផ្គង់។",
    s07_desc: "បង្កើតឡើងសម្រាប់ស្ថាបត្យករ ក្រុមហ៊ុនអភិវឌ្ឍន៍ និងក្រុមហ៊ុនម៉ៅការសំណង់ទូទាំងប្រទេសកម្ពុជា។ សូមបំពេញព័ត៌មានបឋមខាងក្រោមដើម្បីបញ្ជូនទៅកាន់ផ្នែកចាត់ចែង។",
    brief_f1_num: "០១",
    brief_f1_label: "ឈ្មោះអតិថិជន ឬឈ្មោះក្រុមហ៊ុន",
    brief_f1_ph: "ឧ. ឯកឧត្តម/លោកឧកញ៉ា ឬក្រុមហ៊ុនអភិវឌ្ឍន៍...",
    brief_f2_num: "០២",
    brief_f2_label: "លេខទូរស័ព្ទ ឬគណនី Telegram",
    brief_f2_ph: "ឧ. 012 932 700 ឬ @username",
    brief_f3_num: "០៣",
    brief_f3_label: "ប្រភេទគម្រោង និងសេវាកម្មចម្បង",
    brief_f3_opt1: "ផ្គត់ផ្គង់បេតុងលាយស្រេច (Ready-Mix Pour)",
    brief_f3_opt2: "សេវាកម្មផលិត និងបុកដាំសសរគ្រឹះបេតុង (Piling)",
    brief_f3_opt3: "សំណង់ស៊ីវិល ស្ពាន និងទំនប់ទឹកធារាសាស្ត្រ",
    brief_f3_opt4: "ការងារកម្រាលបេតុងរោងចក្រ និងផ្លូវបេតុងខាត់រលោង",
    brief_f3_opt5: "សេវាកម្មជួលគ្រឿងចក្រ និងរថយន្តបាញ់បេតុង",
    brief_f4_num: "០៤",
    brief_f4_label: "ទីតាំងគម្រោង និងខេត្ត-ក្រុង",
    brief_f4_ph: "ឧ. ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ ឬក្រុងបាត់ដំបង",
    brief_f5_num: "០៥",
    brief_f5_label: "បរិមាណបេតុងប៉ាន់ស្មាន និងកម្លាំងបេតុង",
    brief_f5_ph: "ឧ. ១,២០០ m³ • កម្លាំង 35 MPa (5,000 PSI)",
    brief_f6_num: "០៦",
    brief_f6_label: "ទំហំការងារ និងកាលវិភាគអនុវត្ត",
    brief_f6_ph: "បញ្ជាក់ព័ត៌មានលម្អិតអំពីផ្លូវចូលការដ្ឋាន កាលវិភាគចាក់បេតុង...",
    brief_btn_submit: "បញ្ជូនព័ត៌មានគម្រោងទៅកាន់ Telegram @thendLP",

    // Modal
    modal_spec_title: "សន្លឹកទិន្នន័យបច្ចេកទេសគម្រោង",
    modal_client_lbl: "ម្ចាស់គម្រោង៖",
    modal_location_lbl: "ទីតាំងសំណង់៖",
    modal_timeline_lbl: "កាលបរិច្ឆេទសាងសង់៖",
    modal_scope_lbl: "ទំហំការងារវិស្វកម្ម៖",
    modal_btn_inquire: "សាកសួរគម្រោងស្រដៀងគ្នាតាម Telegram @thendLP",
    modal_btn_close: "បិទផ្ទាំងទិន្នន័យ",

    // Footer
    footer_tag: "ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី (BCE)",
    footer_desc: "គ្រប់គ្រងស្ថានីយបេតុង ៤ កន្លែង រថយន្តលាយបេតុង ៤១ គ្រឿង រថយន្តបាញ់បេតុង ៨ គ្រឿង និងគ្រឿងចក្របុកគ្រឹះ ៧ គ្រឿង គ្របដណ្តប់ ១៤ ខេត្ត-រាជធានី។ មានអាជ្ញាបណ្ណ និងវិញ្ញាបនបត្រស្របច្បាប់ពីក្រសួងសាធារណការ និងដឹកជញ្ជូន។",
    footer_address_title: "ទីស្នាក់ការកណ្តាល និងស្ថានីយផលិតកម្មមេ",
    footer_address_val: "ភូមិអង់ សង្កាត់អូរចារ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង ព្រះរាជាណាចក្រកម្ពុជា។",
    footer_hours_title: "ម៉ោងធ្វើការ និងការចាត់ចែង",
    footer_hours_val: "ច័ន្ទ – អាទិត្យ៖ ០៦:៣០ – ១៧:៣០ (មានសេវាចាក់បេតុង ២៤ ម៉ោងតាមកាលវិភាគ)",
    footer_hotlines_title: "ខ្សែទូរស័ព្ទទំនាក់ទំនងផ្ទាល់",
    footer_copyright: "© ២០២៦ ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី។ រក្សាសិទ្ធិគ្រប់យ៉ាង។ វិស្វកម្មប្រកបដោយភាពរឹងមាំយូរអង្វែង។"
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

  // Update input placeholders
  const phElements = document.querySelectorAll('[data-i18n-ph]');
  phElements.forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update button states in top navigation
  const btnEn = document.getElementById('lang-btn-en');
  const btnKh = document.getElementById('lang-btn-kh');
  if (btnEn && btnKh) {
    if (lang === 'en') {
      btnEn.className = "px-2.5 py-1 text-[11px] font-mono-spec font-bold rounded bg-amber-500 text-slate-950 transition";
      btnKh.className = "px-2.5 py-1 text-[11px] font-mono-spec font-medium text-slate-400 hover:text-white transition";
    } else {
      btnKh.className = "px-2.5 py-1 text-[11px] font-mono-spec font-bold rounded bg-amber-500 text-slate-950 transition";
      btnEn.className = "px-2.5 py-1 text-[11px] font-mono-spec font-medium text-slate-400 hover:text-white transition";
    }
  }

  // Re-render project cards to update titles and tags
  renderProjects(currentFilter);
}

// 3. Render Projects Grid (Storey Editorial Layout)
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
    const projId = `BCE-${String(p.id).padStart(3, '0')}`;

    return `
      <article class="group bg-white rounded-none border border-black/10 hover:border-black/30 transition-all duration-300 flex flex-col justify-between">
        <!-- Photo Container with Hairline Frame -->
        <div class="relative aspect-[16/10] bg-neutral-900 overflow-hidden cursor-pointer arch-img-frame" onclick="openProjectModal(${p.id})">
          <img src="${p.image}" alt="${title}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <!-- Top Tags -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span class="px-2 py-0.5 text-[10px] font-mono-spec tracking-widest bg-amber-500 text-slate-950 font-bold uppercase">
              ${projId}
            </span>
            <span class="px-2 py-0.5 text-[10px] font-mono-spec tracking-widest bg-black/60 backdrop-blur-md text-white/90 border border-white/10 uppercase">
              ${p.period}
            </span>
          </div>

          <!-- Bottom Category Tag -->
          <div class="absolute bottom-3 left-3">
            <span class="text-[11px] font-mono-spec uppercase tracking-wider text-white/90 bg-black/50 px-2 py-1 backdrop-blur-sm border border-white/10">
              ${cat}
            </span>
          </div>
        </div>
        
        <!-- Spec Card Body -->
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 class="font-display text-lg font-medium text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-2">
              ${title}
            </h3>
            
            <p class="text-xs text-neutral-500 flex items-center gap-1.5 mb-3 font-mono-spec">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
              <span>${loc}</span>
            </p>

            <div class="space-y-1.5 text-xs text-neutral-600 bg-neutral-50 p-3 border border-neutral-200/70 font-mono-spec text-[11px]">
              <div class="truncate">
                <span class="text-neutral-400 uppercase tracking-wider">${currentLang === 'kh' ? 'ម្ចាស់គម្រោង៖' : 'Client:'}</span> 
                <strong class="text-neutral-800">${client}</strong>
              </div>
              <div class="line-clamp-2 leading-relaxed">
                <span class="text-neutral-400 uppercase tracking-wider">${currentLang === 'kh' ? 'ការងារ៖' : 'Scope:'}</span> 
                <span class="text-neutral-700">${scope}</span>
              </div>
            </div>
          </div>
          
          <!-- Action Button -->
          <button onclick="openProjectModal(${p.id})" class="w-full py-2.5 px-4 rounded-none text-xs font-mono-spec font-semibold uppercase tracking-widest bg-neutral-900 hover:bg-amber-600 text-white flex items-center justify-between transition-colors">
            <span>${currentLang === 'kh' ? 'ពិនិត្យទិន្នន័យបច្ចេកទេស' : 'Inspect Specifications'}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors"></i>
          </button>
        </div>
      </article>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const f = btn.getAttribute('data-filter');
    if (f === filter) {
      btn.className = "filter-btn px-4 py-2 text-xs font-mono-spec uppercase tracking-wider bg-neutral-900 text-white border border-neutral-900 shadow-sm transition-all";
    } else {
      btn.className = "filter-btn px-4 py-2 text-xs font-mono-spec uppercase tracking-wider bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-all";
    }
  });
}

// 4. Project Modal (Clean Technical Blueprint Inspector)
function openProjectModal(id) {
  const p = projectsData.find(item => item.id === id);
  if (!p) return;

  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const title = currentLang === 'kh' ? p.titleKh : p.titleEn;
  const cat = currentLang === 'kh' ? p.categoryKh : p.categoryEn;
  const client = currentLang === 'kh' ? p.clientKh : p.clientEn;
  const loc = currentLang === 'kh' ? p.locationKh : p.locationEn;
  const scope = currentLang === 'kh' ? p.scopeKh : p.scopeEn;
  const projId = `BCE-PROJ-${String(p.id).padStart(3, '0')}`;

  const titleEl = document.getElementById('modal-title');
  const catEl = document.getElementById('modal-category');
  const imgEl = document.getElementById('modal-img');
  const clientEl = document.getElementById('modal-client');
  const locEl = document.getElementById('modal-location');
  const timeEl = document.getElementById('modal-timeline');
  const scopeEl = document.getElementById('modal-scope');

  if (titleEl) titleEl.textContent = title;
  if (catEl) catEl.textContent = `${projId} // ${cat}`;
  if (imgEl) imgEl.src = p.image;
  if (clientEl) clientEl.textContent = client;
  if (locEl) locEl.textContent = loc;
  if (timeEl) timeEl.textContent = p.period;
  if (scopeEl) scopeEl.textContent = scope;

  // Telegram Direct Inquiry URL
  const orderMsg = encodeURIComponent(`Hello BCE Dispatch! I am inquiring regarding project profile ${projId}: ${p.titleEn} (${p.locationEn}). Please provide mix design specifications and delivery feasibility.`);
  const telegramBtn = document.getElementById('modal-telegram-btn');
  if (telegramBtn) {
    telegramBtn.href = `https://t.me/thendLP?text=${orderMsg}`;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// 5. Interactive Field Engineer Concrete Calculator
function setCalcPreset(preset) {
  const shapeEl = document.getElementById('calc-shape');
  const lInput = document.getElementById('calc-length');
  const wInput = document.getElementById('calc-width');
  const tInput = document.getElementById('calc-thickness');
  const lRange = document.getElementById('calc-length-range');
  const wRange = document.getElementById('calc-width-range');
  const tRange = document.getElementById('calc-thickness-range');

  if (!shapeEl || !lInput) return;

  if (preset === 'slab') {
    shapeEl.value = 'slab';
    lInput.value = 12; wInput.value = 8; tInput.value = 0.15;
  } else if (preset === 'footing') {
    shapeEl.value = 'footing';
    lInput.value = 2.5; wInput.value = 2.5; tInput.value = 0.8;
  } else if (preset === 'column') {
    shapeEl.value = 'column';
    lInput.value = 0.6; wInput.value = 0.6; tInput.value = 4.0;
  } else if (preset === 'wall') {
    shapeEl.value = 'wall';
    lInput.value = 15; wInput.value = 0.3; tInput.value = 2.5;
  }

  if (lRange) lRange.value = lInput.value;
  if (wRange) wRange.value = wInput.value;
  if (tRange) tRange.value = tInput.value;

  document.querySelectorAll('.calc-preset-btn').forEach(btn => {
    if (btn.getAttribute('data-preset') === preset) {
      btn.className = "calc-preset-btn px-3 py-1.5 text-xs font-mono-spec font-bold bg-amber-500 text-slate-950 transition";
    } else {
      btn.className = "calc-preset-btn px-3 py-1.5 text-xs font-mono-spec font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition";
    }
  });

  calculateConcrete();
}

function syncCalcSlider(source, targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.value = source.value;
    calculateConcrete();
  }
}

function calculateConcrete() {
  const shapeEl = document.getElementById('calc-shape');
  const lEl = document.getElementById('calc-length');
  const wEl = document.getElementById('calc-width');
  const tEl = document.getElementById('calc-thickness');
  const gradeEl = document.getElementById('calc-grade');

  if (!lEl || !wEl || !tEl) return;

  const shape = shapeEl ? shapeEl.value : 'slab';
  const l = parseFloat(lEl.value) || 0;
  const w = parseFloat(wEl.value) || 0;
  const t = parseFloat(tEl.value) || 0;
  const grade = gradeEl ? gradeEl.value : '25 MPa';

  const netVol = Math.max(0, l * w * t);
  const orderVol = netVol * 1.05; // 5% buffer for subgrade absorption & pump residue
  const truckLoads7 = Math.ceil(orderVol / 7);
  const batchMinutes = Math.max(5, Math.ceil((orderVol / 70) * 60));

  const netRounded = netVol.toFixed(2);
  const orderRounded = orderVol.toFixed(2);

  const netEl = document.getElementById('calc-net-vol');
  const orderEl = document.getElementById('calc-order-vol');
  const trucksEl = document.getElementById('calc-trucks-count');
  const timeEl = document.getElementById('calc-batch-time');

  if (netEl) netEl.textContent = `${netRounded} m³`;
  if (orderEl) orderEl.textContent = `${orderRounded} m³`;
  if (trucksEl) trucksEl.textContent = `${truckLoads7} Truck${truckLoads7 > 1 ? 's' : ''} (7m³ standard)`;
  if (timeEl) timeEl.textContent = `~${batchMinutes} mins batch duration`;

  // Pre-filled Telegram RFQ URL
  const shapeName = shape.toUpperCase();
  const telegramMsg = encodeURIComponent(
    `Hello BCE Operations! Online Volumetric Order Inquiry:
• Structure: ${shapeName}
• Geometry: ${l}m (L) × ${w}m (W) × ${t}m (Thickness/Height)
• Net Volume: ${netRounded} m³
• Recommended Order (+5% Buffer): ${orderRounded} m³
• Required Fleet: ~${truckLoads7} Transit Mixers (7m³)
• Target Mix Strength: ${grade}
Please send official quotation and batching delivery schedule.`
  );
  
  const quoteBtn = document.getElementById('calc-telegram-quote');
  if (quoteBtn) {
    quoteBtn.href = `https://t.me/thendLP?text=${telegramMsg}`;
  }
}

// 6. Storey-Style Spatial Brief Tender Submission
function handleSpatialBriefSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('brief-name') ? document.getElementById('brief-name').value : '';
  const phone = document.getElementById('brief-phone') ? document.getElementById('brief-phone').value : '';
  const service = document.getElementById('brief-service') ? document.getElementById('brief-service').value : '';
  const location = document.getElementById('brief-location') ? document.getElementById('brief-location').value : '';
  const volume = document.getElementById('brief-volume') ? document.getElementById('brief-volume').value : '';
  const scope = document.getElementById('brief-scope') ? document.getElementById('brief-scope').value : '';

  const msg = encodeURIComponent(
    `BCE Spatial Tender Brief:
• 01 Client: ${name}
• 02 Contact: ${phone}
• 03 Typology: ${service}
• 04 Site Location: ${location}
• 05 Volume & Grade: ${volume}
• 06 Scope & Schedule: ${scope}`
  );

  window.open(`https://t.me/thendLP?text=${msg}`, '_blank');

  alert(currentLang === 'kh'
    ? "សូមអរគុណ! ព័ត៌មានគម្រោងត្រូវបានបញ្ជូនទៅផ្នែកចាត់ចែង BCE។ វិស្វករយើងនឹងទាក់ទងមកលោកអ្នកភ្លាមៗ។"
    : "Thank you! Your project spatial brief has been dispatched to BCE Engineering. Our desk will contact you promptly."
  );
}

// 7. Interactive Cambodia Province Selector
const provinceData = {
  "battambang": {
    nameEn: "Battambang (Headquarters & Central Plant)",
    nameKh: "បាត់ដំបង (ទីស្នាក់ការកណ្តាល និងស្ថានីយបេតុងមេ)",
    descEn: "BCE central logistics hub: 4 computerized batching plants (70 m³/hr each), 41 GPS mixer fleet depot, heavy piling rigs, and certified testing lab.",
    descKh: "មជ្ឈមណ្ឌលប្រតិបត្តិការមេ BCE៖ ស្ថានីយបេតុងស្វ័យប្រវត្តិ ៤ កន្លែង រថយន្តលាយ ៤១ គ្រឿង គ្រឿងចក្របុកគ្រឹះ និងមន្ទីរពិសោធន៍គុណភាព។",
    flagship: "Sala Ta On Dam, Prek Trap Bridge, Polyclinic Hospital, Battambang Conch Cement"
  },
  "phnom_penh": {
    nameEn: "Phnom Penh Capital",
    nameKh: "រាជធានីភ្នំពេញ",
    descEn: "Government ministries, institutional academies, multi-story residences, and heavy structural foundations.",
    descKh: "ការផ្គត់ផ្គង់ និងសាងសង់សម្រាប់ស្ថាប័នរដ្ឋាភិបាល អគារសិក្សា និងលំនៅឋានពហុជាន់។",
    flagship: "Ministry of Interior (MoI) NASLA Academic Complex & Dormitory"
  },
  "banteay_meanchey": {
    nameEn: "Banteay Meanchey & Poipet City",
    nameKh: "បន្ទាយមានជ័យ និងក្រុងប៉ោយប៉ែត",
    descEn: "High-volume ready-mix supply and structural engineering for multi-story towers, universities, and commercial zones.",
    descKh: "ការផ្គត់ផ្គង់បេតុងលាយស្រេច និងសាងសង់អគារខ្ពស់ៗ ហេដ្ឋារចនាសម្ព័ន្ធព្រំដែន និងសាកលវិទ្យាល័យ។",
    flagship: "18-Floor Poipet Tower, 11-Floor Building, Build Bright University (BBU)"
  },
  "pursat": {
    nameEn: "Pursat Province",
    nameKh: "ខេត្តពោធិ៍សាត់",
    descEn: "Heavy hydraulic piling and mass concrete foundations for renewable utility-scale solar generation plants.",
    descKh: "ការបុក និងដាំសសរគ្រឹះបេតុងធារាសាស្ត្រសម្រាប់រោងចក្រថាមពលពន្លឺព្រះអាទិត្យខ្នាតធំ។",
    flagship: "Schneitec 100 MW Solar Power Plant Piling Works"
  },
  "koh_kong": {
    nameEn: "Koh Kong & Maritime Coast",
    nameKh: "ខេត្តកោះកុង និងតំបន់ឆ្នេរ",
    descEn: "Sulfate-resistant marine concrete for coastal access corridors and deep-water commercial seaport structures.",
    descKh: "ការងារបេតុងធន់ទឹកប្រៃ ផ្លូវឆ្នេរសមុទ្រ និងហេដ្ឋារចនាសម្ព័ន្ធកំពង់ផែ។",
    flagship: "Chroy Pros Deep Sea Port Infrastructure"
  },
  "preah_vihear": {
    nameEn: "Preah Vihear Province",
    nameKh: "ខេត្តព្រះវិហារ",
    descEn: "National security highways, reinforced concrete canal lining, and ministry irrigation subprojects.",
    descKh: "ការសាងសង់ផ្លូវជាតិយុទ្ធសាស្ត្រ និងប្រព័ន្ធធារាសាស្ត្រប្រឡាយមេ។",
    flagship: "Teuk Krahom Main Canal Rehabilitation (MOWRAM)"
  }
};

function selectProvince(key) {
  const p = provinceData[key];
  if (!p) return;

  const titleEl = document.getElementById('province-title');
  const descEl = document.getElementById('province-desc');
  const flagEl = document.getElementById('province-flagship');

  if (titleEl) titleEl.textContent = currentLang === 'kh' ? p.nameKh : p.nameEn;
  if (descEl) descEl.textContent = currentLang === 'kh' ? p.descKh : p.descEn;
  if (flagEl) flagEl.textContent = p.flagship;

  document.querySelectorAll('.province-tab').forEach(tab => {
    if (tab.getAttribute('data-prov') === key) {
      tab.className = "province-tab px-4 py-2.5 text-xs font-mono-spec font-bold uppercase tracking-wider bg-amber-500 text-slate-950 transition";
    } else {
      tab.className = "province-tab px-4 py-2.5 text-xs font-mono-spec font-medium uppercase tracking-wider bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition";
    }
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam === 'kh' || langParam === 'en') {
    setLanguage(langParam);
  } else {
    renderProjects('all');
  }

  selectProvince('battambang');
  calculateConcrete();

  // Open modal if proj param specified
  const projParam = urlParams.get('proj');
  if (projParam) {
    const id = parseInt(projParam, 10);
    if (!isNaN(id)) openProjectModal(id);
  }

  // Modal keyboard listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

  // Attach live calculation listeners
  ['calc-length', 'calc-width', 'calc-thickness', 'calc-shape', 'calc-grade'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateConcrete);
      el.addEventListener('change', calculateConcrete);
    }
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
