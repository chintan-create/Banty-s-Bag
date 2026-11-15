import heroKutchiImg from '../assets/images/hero_kutchi_textile_atelier_1793621497704.jpg';
import ajrakhKurtaImg from '../assets/images/product_ajrakh_indigo_kurta_1793621499146.jpg';
import bhujodiShawlImg from '../assets/images/product_bhujodi_kala_cotton_shawl_1793621501170.jpg';
import bandhaniDupattaImg from '../assets/images/product_bandhani_gajji_silk_dupatta_1793621503359.jpg';
import rabariJacketImg from '../assets/images/product_rabari_mirror_jacket_1793621505071.jpg';
import mashruDressImg from '../assets/images/product_mashru_silk_kaftan_dress_1793621507458.jpg';
import kediyuAngrakhaImg from '../assets/images/product_kediyu_handloom_angrakha_1793621506897.jpg';
import { CategoryFilter, Product } from '../types';

export const HERO_SHOWCASE_IMAGE = heroKutchiImg;

export const FREE_SHIPPING_THRESHOLD = 5000;

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'ajrakhpur-indigo-kurta',
    sku: 'KT-01',
    name: 'Ajrakhpur 16-Step Natural Indigo Kurta',
    category: CategoryFilter.KurtasTunics,
    subCategory: 'Ajrakh Block Print',
    craftVillage: 'Ajrakhpur, Kutch',
    primaryMaterial: 'Organic Cotton · Natural Indigo & Madder',
    basePrice: 4850,
    statusNote: 'Ready to Ship',
    inStock: true,
    leadTimeLabel: 'Dispatches from Bhuj within 48 hours',
    leadTimeDays: 2,
    image: ajrakhKurtaImg,
    imageAlt:
      'Ajrakhpur hand-block printed natural indigo and madder crimson organic cotton long kurta with carved coconut buttons',
    summary:
      'Hand-block printed in Ajrakhpur using carved seasoned Burma teak blocks through a traditional 16-stage process of camel-dung scouring, myrobalan mordanting, lime-arabic gum resist, natural indigo vat dyeing, and alizarin madder boiling.',
    craftsmanshipNotes: [
      'Authentic double-sided Riyazi star-and-trellis motifs stamped by 9th-generation Khatri master printers',
      '100% plant and mineral dyes: fermented natural indigo (neel), madder root (majith), and rusted iron-jaggery (kat)',
      'Finished with French-seamed interiors, side pockets, and hand-turned coconut shell buttons',
    ],
    careInstructions: [
      'Hand-wash separately in cold water using mild pH-neutral soap (reetha or gentle liquid wash)',
      'Dry strictly in shade to preserve natural indigo depth; natural plant dyes soften and mellow over wear',
    ],
    dimensions: {
      chestOrWidthCm: 104,
      lengthCm: 112,
      sleeveOrBorderCm: 58,
      fabricWeightGsm: 145,
      isDrape: false,
    },
    finishes: [
      {
        id: 'indigo-madder-s',
        name: 'Indigo & Madder Crimson — Size S (Chest 38")',
        swatchHex: '#1E3A5F',
        priceDelta: 0,
        leadTimeDays: 2,
        inStock: true,
      },
      {
        id: 'indigo-madder-m',
        name: 'Indigo & Madder Crimson — Size M (Chest 40")',
        swatchHex: '#25476E',
        priceDelta: 0,
        leadTimeDays: 2,
        inStock: true,
      },
      {
        id: 'kashish-earth-l',
        name: 'Kashish Iron-Earth & Indigo — Size L (Chest 42")',
        swatchHex: '#5A382E',
        priceDelta: 250,
        leadTimeDays: 3,
        inStock: true,
      },
    ],
    reviews: [
      {
        id: 'rev-kt-01',
        author: 'Nandini Mehta',
        role: 'Textile Researcher',
        location: 'Ahmedabad',
        rating: 5,
        date: 'October 2026',
        title: 'Unmistakable scent and depth of real Ajrakhpur vat indigo',
        comment:
          'You can immediately tell real natural-dyed Ajrakh from screen-printed imitations by the crisp back-and-front block registration and cool breathable handfeel in Gujarat heat.',
      },
      {
        id: 'rev-kt-02',
        author: 'Rohan Deshmukh',
        role: 'Architect',
        location: 'Pune',
        rating: 5,
        date: 'September 2026',
        title: 'Clean tailoring with zero synthetic lining',
        comment:
          'French seams inside are immaculate and the collar sits flat. After three cold shade-dried washes the cotton feels like butter.',
      },
    ],
  },
  {
    id: 'kediyu-kala-cotton-angrakha',
    sku: 'KT-02',
    name: 'Kediyu Pintucked Kala Cotton Angrakha',
    category: CategoryFilter.JacketsWraps,
    subCategory: 'Kediyu & Wrap Tops',
    craftVillage: 'Bhujodi & Khamir Cluster, Kutch',
    primaryMaterial: '100% Rain-Fed Indigenous Kala Cotton',
    basePrice: 3950,
    statusNote: 'Ready to Ship',
    inStock: true,
    leadTimeLabel: 'Dispatches from Bhuj within 48 hours',
    leadTimeDays: 2,
    image: kediyuAngrakhaImg,
    imageAlt:
      'Contemporary Kutchi Kediyu angrakha wrap top in unbleached Kala cotton with chest pleats, woven Bhujodi trim, and handmade cotton tassels',
    summary:
      'A contemporary everyday silhouette rooted in the pastoral Kutchi Kediyu—tailored from zero-irrigation indigenous short-staple Kala cotton with fine diagonal chest pintucks, gentle waist gathers, and handwoven Bhujodi border trims.',
    craftsmanshipNotes: [
      'Woven from 100% organic rain-fed Kutchi Kala cotton grown without synthetic pesticides or groundwater irrigation',
      'Hand-pleated chest yoke paired with double side-tie cords finished with handmade red-and-indigo cotton foomka tassels',
      'Trimmed at cuffs and crossover placket with extra-weft pit-loom borders woven in Bhujodi',
    ],
    careInstructions: [
      'Gentle cold hand-wash or delicate cycle inside a laundry bag to protect handmade tassels',
      'Steam or warm-iron while slightly damp; unbleached Kala cotton grows softer with every wash',
    ],
    dimensions: {
      chestOrWidthCm: 99,
      lengthCm: 68,
      sleeveOrBorderCm: 56,
      fabricWeightGsm: 165,
      isDrape: false,
    },
    finishes: [
      {
        id: 'kora-ecru-s',
        name: 'Unbleached Kora Ecru — Size S (Bust/Chest 36")',
        swatchHex: '#EAE2D3',
        priceDelta: 0,
        leadTimeDays: 2,
        inStock: true,
      },
      {
        id: 'kora-ecru-m',
        name: 'Unbleached Kora Ecru — Size M (Bust/Chest 38")',
        swatchHex: '#E4DBC9',
        priceDelta: 0,
        leadTimeDays: 2,
        inStock: true,
      },
      {
        id: 'kora-ecru-l',
        name: 'Unbleached Kora Ecru — Size L (Bust/Chest 41")',
        swatchHex: '#DDD3BE',
        priceDelta: 0,
        leadTimeDays: 2,
        inStock: true,
      },
    ],
    reviews: [
      {
        id: 'rev-kt-03',
        author: 'Kavita Jadeja',
        role: 'Design Educator',
        location: 'Vadodara',
        rating: 5,
        date: 'October 2026',
        title: 'Authentic Kediyu flare adapted effortlessly for daily wear',
        comment:
          'Pairs beautifully with both indigo denims and wide cotton palazzos. The Bhujodi border along the neckline and handmade tassels show genuine Kutchi detail.',
      },
    ],
  },
  {
    id: 'rabari-mirror-bandi-jacket',
    sku: 'KT-03',
    name: 'Rabari Abhla Mirror Kala Cotton Bandi',
    category: CategoryFilter.JacketsWraps,
    subCategory: 'Embroidered Jackets',
    craftVillage: 'Sumrasar Sheikh, Kutch',
    primaryMaterial: 'Handspun Kala Cotton & Shisha Mirrors',
    basePrice: 5600,
    statusNote: 'Small Batch',
    inStock: true,
    leadTimeLabel: 'Ships in 3–4 business days',
    leadTimeDays: 3,
    image: rabariJacketImg,
    imageAlt:
      'Charcoal-black handspun Kala cotton sleeveless Bandi waistcoat jacket featuring authentic Kutchi Rabari mirror-work embroidery',
    summary:
      'Tailored from structured charcoal-dyed Kala cotton and hand-embroidered by women artisans of the pastoral Rabari community in Sumrasar using real glass shisha mirrors (abhla), chain stitch (sankali), and vibrant resham accents.',
    craftsmanshipNotes: [
      'Each collar yoke and twin patch pocket requires 18+ hours of freehand Rabari needlework and mirror couching',
      'Woven on traditional pit looms in weighty 220 GSM handspun Kala cotton with soft unbleached mulmul lining',
      'Hand-carved sheesham wood front buttons and clean welt chest pocket',
    ],
    careInstructions: [
      'Spot-clean or dry-clean only to preserve hand-couched glass shisha mirrors and silk embroidery threads',
      'Air out in indirect breeze after wear; store on a wide wooden hanger',
    ],
    dimensions: {
      chestOrWidthCm: 104,
      lengthCm: 69,
      sleeveOrBorderCm: 24,
      fabricWeightGsm: 220,
      isDrape: false,
    },
    finishes: [
      {
        id: 'charcoal-rabari-m',
        name: 'Charcoal Black / Multi-Resham — Size M (40")',
        swatchHex: '#2B2D2F',
        priceDelta: 0,
        leadTimeDays: 3,
        inStock: true,
      },
      {
        id: 'charcoal-rabari-l',
        name: 'Charcoal Black / Multi-Resham — Size L (42")',
        swatchHex: '#1F2022',
        priceDelta: 0,
        leadTimeDays: 3,
        inStock: true,
      },
      {
        id: 'deep-indigo-rabari-xl',
        name: 'Deep Indigo / Crimson Mirror — Size XL (44")',
        swatchHex: '#1D2E4A',
        priceDelta: 300,
        leadTimeDays: 5,
        inStock: true,
      },
    ],
    reviews: [
      {
        id: 'rev-kt-04',
        author: 'Siddharth Rao',
        role: 'Documentary Filmmaker',
        location: 'Mumbai',
        rating: 5,
        date: 'October 2026',
        title: 'Heirloom embroidery that elevates a plain white kurta instantly',
        comment:
          'Wore this over a kora cotton kurta for an exhibition opening. Every mirror is hand-locked in dense threadwork—not glued plastic!',
      },
    ],
  },
  {
    id: 'mashru-silk-suf-tunic',
    sku: 'KT-04',
    name: 'Mashru Silk-Cotton Suf Embroidered Dress',
    category: CategoryFilter.KurtasTunics,
    subCategory: 'Mashru Silk Apparel',
    craftVillage: 'Mandvi & Bhuj, Kutch',
    primaryMaterial: 'Handloom Mashru Silk-Cotton & Suf Stitch',
    basePrice: 7400,
    statusNote: 'Artisan Edition',
    inStock: true,
    leadTimeLabel: 'Ships in 4–6 business days',
    leadTimeDays: 5,
    image: mashruDressImg,
    imageAlt:
      'Handloom Kutchi Mashru silk-cotton striped tunic dress in peacock teal, turmeric ochre, and crimson with geometric Suf neckline embroidery',
    summary:
      'Woven in the historic satin-weave Mashru technique—placing lustrous jewel-striped mulberry silk on the exterior face while keeping pure soft cotton against the skin—crowned with counted-thread geometric Suf embroidery.',
    craftsmanshipNotes: [
      'Traditional warp-faced satin weave (silk outside, breathable cotton inside) engineered for desert-to-evening comfort',
      'Counted-thread Suf triangle embroidery worked from the reverse side of the cloth without drawn guidelines',
      'Relaxed A-line midi silhouette with concealed in-seam pockets and three-quarter sleeves',
    ],
    careInstructions: [
      'Dry-clean recommended to retain the luminous satin sheen of the silk warp',
      'Steam lightly from the reverse cotton face on low heat; never spray water directly onto Mashru silk',
    ],
    dimensions: {
      chestOrWidthCm: 102,
      lengthCm: 108,
      sleeveOrBorderCm: 46,
      fabricWeightGsm: 175,
      isDrape: false,
    },
    finishes: [
      {
        id: 'peacock-turmeric-s',
        name: 'Peacock Teal & Turmeric Stripe — Size S (36")',
        swatchHex: '#136F72',
        priceDelta: 0,
        leadTimeDays: 5,
        inStock: true,
      },
      {
        id: 'peacock-turmeric-m',
        name: 'Peacock Teal & Turmeric Stripe — Size M (38")',
        swatchHex: '#C58B24',
        priceDelta: 0,
        leadTimeDays: 5,
        inStock: true,
      },
      {
        id: 'madder-emerald-l',
        name: 'Crimson & Emerald Stripe — Size L (41")',
        swatchHex: '#8E2430',
        priceDelta: 400,
        leadTimeDays: 6,
        inStock: true,
      },
    ],
    reviews: [
      {
        id: 'rev-kt-05',
        author: 'Ananya Sen',
        role: 'Curator',
        location: 'Bengaluru',
        rating: 5,
        date: 'September 2026',
        title: 'Lustrous like pure silk outside, cool like soft mulmul inside',
        comment:
          'Mashru is pure textile genius. Even in humid weather the cotton backing breathes effortlessly, and the mathematical precision of the Suf yoke is breathtaking.',
      },
    ],
  },
  {
    id: 'bhujodi-kala-cotton-shawl',
    sku: 'KT-05',
    name: 'Bhujodi Extra-Weft Kala Cotton Shawl',
    category: CategoryFilter.ShawlsDupattas,
    subCategory: 'Bhujodi Handloom',
    craftVillage: 'Bhujodi Village, Kutch',
    primaryMaterial: 'Pit-Loom Kala Cotton · Extra-Weft',
    basePrice: 4200,
    statusNote: 'Ready to Ship',
    inStock: true,
    leadTimeLabel: 'Dispatches from Bhuj within 24 hours',
    leadTimeDays: 1,
    image: bhujodiShawlImg,
    imageAlt:
      'Handwoven Bhujodi unbleached Kala cotton stole and shawl with traditional raised extra-weft geometric diamond motifs and hand-twisted fringes',
    summary:
      'Handwoven on throw-shuttle pit looms by Vankar master weavers in Bhujodi village, featuring tactile raised Chaumak and Sachchi Kor geometric motifs inserted by hand between weft picks—resembling embroidery woven directly on the loom.',
    craftsmanshipNotes: [
      'GI-tagged Kutchi weaving heritage practiced by Vankar artisan families in Bhujodi',
      'Hand-inserted extra-weft geometric borders in iron-black and madder terracotta on unbleached Kala cotton',
      'Generous 215 × 92 cm full-shoulder wrap finished with hand-knotted twisted warp fringes',
    ],
    careInstructions: [
      'Gentle cold hand-wash with mild liquid detergent; do not wring or bleach',
      'Dry flat in shade and press with a medium steam iron',
    ],
    dimensions: {
      chestOrWidthCm: 92,
      lengthCm: 215,
      sleeveOrBorderCm: 18,
      fabricWeightGsm: 190,
      isDrape: true,
    },
    finishes: [
      {
        id: 'ecru-terracotta-charcoal',
        name: 'Natural Kora / Terracotta & Charcoal Motifs',
        swatchHex: '#B6533E',
        priceDelta: 0,
        leadTimeDays: 1,
        inStock: true,
      },
      {
        id: 'indigo-ecru-dhabla',
        name: 'Deep Indigo / Kora Extra-Weft Motifs',
        swatchHex: '#233B5D',
        priceDelta: 350,
        leadTimeDays: 2,
        inStock: true,
      },
    ],
    reviews: [
      {
        id: 'rev-kt-06',
        author: 'Vikramaditya Joshi',
        role: 'Professor of Literature',
        location: 'New Delhi',
        rating: 5,
        date: 'October 2026',
        title: 'Substantial handspun drape for winter mornings and travel',
        comment:
          'The raised extra-weft diamonds have incredible tactile character. Works equally well over a bandhgala, kurta, or winter coat.',
      },
    ],
  },
  {
    id: 'bandhani-gajji-silk-dupatta',
    sku: 'KT-06',
    name: 'Jhinkhu Bandhani Pure Gajji Silk Odhani',
    category: CategoryFilter.ShawlsDupattas,
    subCategory: 'Kutchi Bandhani',
    craftVillage: 'Bhuj & Mandvi, Kutch',
    primaryMaterial: 'Pure Gajji Silk & Zari Pallu',
    basePrice: 11800,
    statusNote: 'Masterpiece Loom',
    inStock: true,
    leadTimeLabel: 'Ships in 5–7 business days',
    leadTimeDays: 6,
    image: bandhaniDupattaImg,
    imageAlt:
      'Authentic Kutchi Jhinkhu Bandhani hand-tied pure Gajji silk dupatta odhani in crimson and saffron yellow micro tie-dye dots with zari border',
    summary:
      'An heirloom Kutchi Jhinkhu (fine-dot) Bandhani odhani worked on fluid, heavy-drape pure Gajji silk—hand-pinched and tied with over 18,000 tiny rai knots by Khatri women artisans in Bhuj and Mandvi before sequential resist-dyeing in saffron and madder crimson.',
    craftsmanshipNotes: [
      'Over 18,000 individual fingernail-pinched tie-dye knots forming traditional Rasamandala medallion and बेल (vine) borders',
      'Dyed on heavy satin-weave pure Gajji silk with authentic woven golden zari lagdi pallu and selvedge',
      'Delivered partially crushed to showcase authentic hand-tied relief (can be worn textured or steam-relaxed)',
    ],
    careInstructions: [
      'Strictly specialist silk dry-clean only; never wash in water or expose wet silk to sunlight',
      'Wrap in unbleached cotton mulmul cloth (included with order) inside your wardrobe',
    ],
    dimensions: {
      chestOrWidthCm: 110,
      lengthCm: 245,
      sleeveOrBorderCm: 22,
      fabricWeightGsm: 115,
      isDrape: true,
    },
    finishes: [
      {
        id: 'crimson-haldi-gajji',
        name: 'Madder Crimson & Haldi Saffron / Gold Zari',
        swatchHex: '#981B2B',
        priceDelta: 0,
        leadTimeDays: 6,
        inStock: true,
      },
      {
        id: 'morpankh-indigo-gajji',
        name: 'Morpankh Emerald & Deep Maroon / Gold Zari',
        swatchHex: '#15524B',
        priceDelta: 600,
        leadTimeDays: 7,
        inStock: true,
      },
    ],
    reviews: [
      {
        id: 'rev-kt-07',
        author: 'Meenakshi Thakkar',
        role: 'Classical Vocalist',
        location: 'Mumbai',
        rating: 5,
        date: 'October 2026',
        title: 'Museum-grade rai knots and unmistakable Gajji silk fall',
        comment:
          'Growing up with Kutch textiles in our family, finding true fine-knot Khatri Bandhani on real Gajji silk online is rare. Worth every rupee—an heirloom piece.',
      },
    ],
  },
];
