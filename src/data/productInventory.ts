import { Product, normalizeSlug } from "./products";

type RawInventoryEntry = {
  sku: string;
  brand: string;
  name: string;
  targetAudience: string;
  category: string;
  scent_profile: string[];
  image: string;
  price?: number;
  volume_ml?: number;
  updatedAt?: number;
};

const rawInventory: RawInventoryEntry[] = [
  {
    sku: "S-050",
    brand: "Saria 69",
    name: "Good Men",
    targetAudience: "Men",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/jSTc0wr/SARIA-69-GOOD-MEN-PERFUME.jpg",
  },
  {
    sku: "S-044",
    brand: "Saria 69",
    name: "Sauvage",
    targetAudience: "Men",
    category: "Spicy",
    scent_profile: ["Spicy"],
    image: "https://i.ibb.co/SwknyQfw/SARIA-69-SAUYAGE-PERFUME.webp",
  },
  {
    sku: "S-042",
    brand: "Saria 69",
    name: "Saria Egoist",
    targetAudience: "Men",
    category: "Woody & Spicy",
    scent_profile: ["Spicy", "Woody"],
    image: "https://i.ibb.co/9kzpbfyn/SARIA-69-SARIA-EGOIST-PERFUME.webp",
  },
  {
    sku: "S-051",
    brand: "Saria 69",
    name: "Essentiel Sport",
    targetAudience: "Men",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/QvZBsJNB/SAR-A-69-ESSENTIEL-SPORT-MEN-PERFUME.jpg",
  },
  {
    sku: "S-052",
    brand: "Saria 69",
    name: "Essentiel",
    targetAudience: "Men",
    category: "Woody",
    scent_profile: ["Woody"],
    image: "https://i.ibb.co/KjNCpzjF/SARIA-69-ESSENTIEL-MEN-PERFUME.jpg",
  },
  {
    sku: "S-053",
    brand: "Saria 69",
    name: "Blanc",
    targetAudience: "Men",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/5Wfn4S8n/SARIA-69-BLANC-MEN-PERFUME.jpg",
  },
  {
    sku: "S-054",
    brand: "Saria 69",
    name: "Milion",
    targetAudience: "Men",
    category: "Spicy & Woody",
    scent_profile: ["Spicy", "Woody"],
    image: "https://i.ibb.co/zhGx1nWt/SARIA-69-MILION-MEN-PERFUME.jpg",
  },
  {
    sku: "S-055",
    brand: "Saria 69",
    name: "No 77",
    targetAudience: "Men",
    category: "Oriental",
    scent_profile: ["Oriental"],
    image: "https://i.ibb.co/JWxBT7Hc/SARIA-69-NO-77-PERFUME.jpg",
  },
  {
    sku: "S-056",
    brand: "Saria 69",
    name: "Black Bery",
    targetAudience: "Men",
    category: "Flowery & Fruity",
    scent_profile: ["Flowery", "Fruity"],
    image: "https://i.ibb.co/wkT1gvx/SAR-A-69-BLACK-BERY-AND-MEN-PERFUME.jpg",
  },
  {
    sku: "S-057",
    brand: "Saria 69",
    name: "Cupa Invic",
    targetAudience: "Men",
    category: "Spicy",
    scent_profile: ["Spicy"],
    image: "https://i.ibb.co/gbjV3kBC/SAR-A-69-CUPA-INVIC-PERFUME.jpg",
  },
  {
    sku: "S-058",
    brand: "Saria 69",
    name: "Bright Crystal",
    targetAudience: "Women",
    category: "Flowery & Fruity",
    scent_profile: ["Flowery", "Fruity"],
    image: "https://i.ibb.co/M5s3Z6pv/Bright-Crystal-3500-Saria-69-50ml-Women.jpg",
    price: 35000,
    volume_ml: 50,
  },
  {
    sku: "S-059",
    brand: "Saria 69",
    name: "Bombshell",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/YTPgT6Fb/SARIA-69-BOMBSHELL-PERFUME.jpg",
  },
  {
    sku: "S-060",
    brand: "Saria 69",
    name: "Missionary",
    targetAudience: "Women",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/Qvkfzf7c/SARIA-69-MISSIONARY-PERFUME.jpg",
  },
  {
    sku: "S-061",
    brand: "Saria 69",
    name: "Bal de Paris",
    targetAudience: "Women",
    category: "Flowery & Fruity",
    scent_profile: ["Flowery", "Fruity"],
    image: "https://i.ibb.co/q3g6bTXq/SARIA-69-BAL-DE-PARIS-PERFUME.jpg",
  },
  {
    sku: "S-062",
    brand: "Saria 69",
    name: "Lost Cherry",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/0yHkdq7j/SARIA-69-LOST-CHERRY-PERFUME.jpg",
  },
  {
    sku: "S-063",
    brand: "Saria 69",
    name: "Peach Passion Fruit Musk",
    targetAudience: "Women",
    category: "Fruity",
    scent_profile: ["Fruity"],
    image: "https://i.ibb.co/sdTmZs3P/SAR-A-69-PEACH-PASSION-FRUIT-MUSK-PERFUME.png",
  },
  {
    sku: "S-064",
    brand: "Saria 69",
    name: "Saria Chocolate",
    targetAudience: "Women",
    category: "Flowery & Fruity",
    scent_profile: ["Flowery", "Fruity"],
    image: "https://i.ibb.co/27WW9mBN/SARIA-69-SARIA-CHOCOLATE-PERFUME.jpg",
  },
  {
    sku: "S-065",
    brand: "Saria 69",
    name: "Saria Rose Musc",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/mCrZd4ZW/SAR-A-69-SARIA-ROSE-MUSC-PERFUME.jpg",
  },
  {
    sku: "S-066",
    brand: "Saria 69",
    name: "Madam Coco",
    targetAudience: "Women",
    category: "Oriental",
    scent_profile: ["Oriental"],
    image: "https://i.ibb.co/605MSbjW/SARIA-69-MADAM-COCO-PERFUME.jpg",
  },
  {
    sku: "S-067",
    brand: "Saria 69",
    name: "Stary Night",
    targetAudience: "Women",
    category: "Woody & Spicy",
    scent_profile: ["Woody", "Spicy"],
    image: "https://i.ibb.co/F4rdYhYS/SAR-A-69-STARY-NIGHT-PERFUME.jpg",
  },
  {
    sku: "S-068",
    brand: "Saria 69",
    name: "Saria Vodka",
    targetAudience: "Women",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/zVTbVvgK/SARIA-69-SARIA-VODKA-PERFUME.jpg",
  },
  {
    sku: "S-069",
    brand: "Saria 69",
    name: "Sea Salt",
    targetAudience: "Women",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/dw9my0Qv/SAR-A-69-SEA-SALT-PERFUME.jpg",
  },
  {
    sku: "S-070",
    brand: "Saria 69",
    name: "Mountain",
    targetAudience: "Women",
    category: "Woody",
    scent_profile: ["Woody"],
    image: "https://i.ibb.co/zW6kB5xS/SARIA-69-MOUNTAIN-PERFUME.jpg",
  },
  {
    sku: "S-071",
    brand: "Saria 69",
    name: "Black Hashish",
    targetAudience: "Women",
    category: "Oriental",
    scent_profile: ["Oriental"],
    image: "https://i.ibb.co/gZgcVFgZ/SARIA-69-BLACK-HASHISH-PERFUME.jpg",
  },
  {
    sku: "S-072",
    brand: "Saria 69",
    name: "Narcissus",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/KctJkF3Z/SARIA-69-NARCISSUS-PERFUME.jpg",
  },
  {
    sku: "S-073",
    brand: "Saria 69",
    name: "Black Musk",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/bjLm7RMM/SARIA-69-BLACK-MUSK-PERFUME.jpg",
  },
  {
    sku: "S-074",
    brand: "Saria 69",
    name: "Marijuane",
    targetAudience: "Women",
    category: "Spicy",
    scent_profile: ["Spicy"],
    image: "https://i.ibb.co/fT9kqHZ/SARIA-69-MARIJUANE-PERFUME.jpg",
  },
  {
    sku: "S-075",
    brand: "Saria 69",
    name: "Vibraator",
    targetAudience: "Women",
    category: "Spicy & Woody",
    scent_profile: ["Spicy", "Woody"],
    image: "https://i.ibb.co/sJqBYgYv/SARIA-69-VIBRAATOR-PERFUME.jpg",
  },
  {
    sku: "S-076",
    brand: "Saria 69",
    name: "Afrodisyac",
    targetAudience: "Women",
    category: "Oriental",
    scent_profile: ["Oriental"],
    image: "https://i.ibb.co/K87fFxZ/SARIA-69-AFRODISYAC-PERFUME.jpg",
  },
  {
    sku: "HG-101",
    brand: "Holigan",
    name: "Holigan Paris",
    targetAudience: "Men",
    category: "Flowery & Fruity",
    scent_profile: ["Flowery", "Fruity"],
    image: "https://i.ibb.co/B5t7Wrpy/HOOLIGAN-PARIS-PERFUME.jpg",
  },
  {
    sku: "HG-102",
    brand: "Holigan",
    name: "Holigan Morocco",
    targetAudience: "Men",
    category: "Oriental",
    scent_profile: ["Oriental"],
    image: "https://i.ibb.co/MxCv2whX/HOOLIGAN-MOROCCO-PERFUME.jpg",
  },
  {
    sku: "HG-103",
    brand: "Holigan",
    name: "Holigan Rome",
    targetAudience: "Men",
    category: "Woody & Spicy",
    scent_profile: ["Woody", "Spicy"],
    image: "https://i.ibb.co/rKb65tGS/HOOLIGAN-ROME-PERFUME.jpg",
  },
  {
    sku: "HG-104",
    brand: "Holigan",
    name: "Holigan London",
    targetAudience: "Men",
    category: "Woody",
    scent_profile: ["Woody"],
    image: "https://i.ibb.co/20bWNDx6/HOOLIGAN-LONDON-PERFUME.jpg",
  },
  {
    sku: "HG-105",
    brand: "Holigan",
    name: "Holigan Kyiv",
    targetAudience: "Men",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/WN8QYttP/HOOLIGAN-KYIV-PERFUME.jpg",
  },
  {
    sku: "HG-106",
    brand: "Holigan",
    name: "Holigan Baku",
    targetAudience: "Men",
    category: "Spicy",
    scent_profile: ["Spicy"],
    image: "https://i.ibb.co/mVYkF8Zx/HOOLIGAN-BAKU-PERFUME.jpg",
  },
  {
    sku: "HG-107",
    brand: "Holigan",
    name: "Holigan Moscow",
    targetAudience: "Men",
    category: "Spicy & Woody",
    scent_profile: ["Spicy", "Woody"],
    image: "https://i.ibb.co/yFvXC50s/HOOLIGAN-MOSCOW-PERFUME.jpg",
  },
  {
    sku: "JT-401",
    brand: "Jutenya",
    name: "Riviere",
    targetAudience: "Men",
    category: "Woody",
    scent_profile: ["Woody"],
    image: "https://i.ibb.co/qLTg6ymm/Riviere-4000-Jutenya-75ml-Men.jpg",
    price: 40000,
    volume_ml: 75,
  },
  {
    sku: "JT-402",
    brand: "Jutenya",
    name: "Light Blue",
    targetAudience: "Women",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/fVSrkrM6/Light-Blue-4000-Jutenya-75ml-Women.jpg",
    price: 40000,
    volume_ml: 75,
  },
  {
    sku: "BK-303",
    brand: "Black Kiss",
    name: "Black Kiss",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/wNY1DVCd/Black-Kiss-4500-75ml-Women.jpg",
    price: 45000,
    volume_ml: 75,
  },
  {
    sku: "RT-203",
    brand: "Royal Touch",
    name: "Queen",
    targetAudience: "Women",
    category: "Flowery",
    scent_profile: ["Flowery"],
    image: "https://i.ibb.co/Cs4D83xN/Queen-4500-Royal-Touch-75ml-Women.jpg",
    price: 45000,
    volume_ml: 75,
  },
  {
    sku: "RT-204",
    brand: "Royal Touch",
    name: "King",
    targetAudience: "Men",
    category: "Woody & Spicy",
    scent_profile: ["Woody", "Spicy"],
    image: "https://i.ibb.co/Y7kgb26S/King-3500-Royal-Touch-60ml-Men.jpg",
    price: 35000,
    volume_ml: 60,
  },
  {
    sku: "RT-201",
    brand: "Royal Touch",
    name: "Beginning",
    targetAudience: "Unisex",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/p6zsM145/ROYAL-TOUCH-BEGINNING-PERFUME.jpg",
  },
  {
    sku: "RT-202",
    brand: "Royal Touch",
    name: "Evolution",
    targetAudience: "Unisex",
    category: "Spicy & Woody",
    scent_profile: ["Spicy", "Woody"],
    image: "https://i.ibb.co/Q7ML8L0d/ROYAL-TOUCH-EVOLUTION-PERFUME.jpg",
  },
  {
    sku: "BK-301",
    brand: "Black Kiss",
    name: "Aphrodisiac",
    targetAudience: "Unisex",
    category: "Oriental",
    scent_profile: ["Oriental"],
    image: "https://i.ibb.co/FkChBkyv/BLACK-KISS-APHRODISIAC-PERFUME.jpg",
  },
  {
    sku: "BK-302",
    brand: "Black Kiss",
    name: "Unisex",
    targetAudience: "Unisex",
    category: "Fresh",
    scent_profile: ["Fresh"],
    image: "https://i.ibb.co/xKrFYc5h/BLACK-KISS-UNISEX-PERFUME.jpg",
  },
];

const featuredSkus = new Set(rawInventory.slice(-4).map((entry) => entry.sku));

const noteLibrary: Record<
  string,
  { top: string[]; middle: string[]; base: string[] }
> = {
  Spicy: {
    top: ["Pink Pepper", "Black Pepper"],
    middle: ["Clove", "Nutmeg"],
    base: ["Amber", "Tonka Bean"],
  },
  Woody: {
    top: ["Cedarwood", "Sandalwood"],
    middle: ["Vetiver", "Patchouli"],
    base: ["Oud", "Guaiac Wood"],
  },
  Flowery: {
    top: ["Neroli", "Orange Blossom"],
    middle: ["Jasmine", "Rose Petals"],
    base: ["White Musk", "Ylang Ylang"],
  },
  Fruity: {
    top: ["Bergamot", "Citrus Zest"],
    middle: ["Pear", "Apple"],
    base: ["Vanilla", "Praline"],
  },
  Oriental: {
    top: ["Bergamot", "Cardamom"],
    middle: ["Incense", "Saffron"],
    base: ["Amber", "Myrrh"],
  },
  Fresh: {
    top: ["Lemon Zest", "Mint Leaf"],
    middle: ["Green Tea", "Lavender"],
    base: ["White Musk", "Cedar"],
  },
};

const notedSections = ["top", "middle", "base"] as const;

function resolveNotes(profile: string[], section: typeof notedSections[number]) {
  const notes = new Set<string>();
  for (const tag of profile) {
    const set = noteLibrary[tag];
    if (!set) continue;
    for (const note of set[section]) {
      notes.add(note);
    }
  }
  return Array.from(notes);
}

const pricedAmount = 40000;
const defaultVolume = 100;
const defaultStock = 120;

function mapAudienceToGender(value: string): Product["gender"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "men") return "men";
  if (normalized === "women") return "women";
  return "unisex";
}

const inventoryProducts: Product[] = rawInventory.map((entry) => {
  const profileLabel = entry.scent_profile.join(" · ");
  const brandSlug = normalizeSlug(entry.brand);
  return {
    id: entry.sku,
    name: entry.name,
    slug: normalizeSlug(entry.name),
    brand: entry.brand,
    brandSlug,
    category: normalizeSlug(entry.category),
    price: entry.price ?? pricedAmount,
    volume_ml: entry.volume_ml ?? defaultVolume,
    gender: mapAudienceToGender(entry.targetAudience),
    short_description: `${entry.brand} ${entry.name} is a ${entry.category.toLowerCase()} statement for ${entry.targetAudience.toLowerCase()} patrons.`,
    long_description: `${entry.name} from ${entry.brand} interlaces ${profileLabel} tones with ${entry.category.toLowerCase()} warmth and a satin finish that lingers through every season.`,
    top_notes: resolveNotes(entry.scent_profile, "top"),
    middle_notes: resolveNotes(entry.scent_profile, "middle"),
    base_notes: resolveNotes(entry.scent_profile, "base"),
    stock_quantity: defaultStock,
    featured: featuredSkus.has(entry.sku),
    image_url: entry.image,
    updatedAt: entry.updatedAt ?? 0,
    scent_profile: entry.scent_profile,
  };
});

export { inventoryProducts };
