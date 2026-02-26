import { Product, normalizeSlug } from "./products";

type RawInventoryEntry = {
  sku: string;
  brand: string;
  name: string;
  targetAudience: string;
  category: string;
  scent_profile: string[];
  image: string;
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
    price: pricedAmount,
    volume_ml: defaultVolume,
    gender: mapAudienceToGender(entry.targetAudience),
    short_description: `${entry.brand} ${entry.name} is a ${entry.category.toLowerCase()} statement for ${entry.targetAudience.toLowerCase()} patrons.`,
    long_description: `${entry.name} from ${entry.brand} interlaces ${profileLabel} tones with ${entry.category.toLowerCase()} warmth and a satin finish that lingers through every season.`,
    top_notes: resolveNotes(entry.scent_profile, "top"),
    middle_notes: resolveNotes(entry.scent_profile, "middle"),
    base_notes: resolveNotes(entry.scent_profile, "base"),
    stock_quantity: defaultStock,
    featured: featuredSkus.has(entry.sku),
    image_url: entry.image,
    scent_profile: entry.scent_profile,
  };
});

export { inventoryProducts };
