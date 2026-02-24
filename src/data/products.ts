import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  volume_ml: number;
  gender: "unisex" | "men" | "women";
  short_description: string;
  long_description: string;
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
  stock_quantity: number;
  featured: boolean;
  image_url: string;
}

export const categories = [
  { id: "saria-69", name: "Saria 69", slug: "saria-69" },
  { id: "black-kiss", name: "Black Kiss", slug: "black-kiss" },
  { id: "royal-touch", name: "Royal Touch", slug: "royal-touch" },
  { id: "holigan", name: "Holigan", slug: "holigan" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Saria 69 – Midnight Elixir",
    slug: "saria-69-midnight-elixir",
    category: "saria-69",
    price: 45000,
    volume_ml: 100,
    gender: "unisex",
    short_description: "A bold, intoxicating blend of dark oud and Turkish rose.",
    long_description: "Saria 69 – Midnight Elixir is a masterpiece of Turkish niche perfumery. This captivating unisex fragrance opens with an electrifying burst of saffron and black pepper, melting into a heart of Damascus rose and oud. The dry down reveals a sensual base of amber, musk, and sandalwood that lingers for hours.",
    top_notes: ["Saffron", "Black Pepper", "Bergamot"],
    middle_notes: ["Damascus Rose", "Oud", "Jasmine"],
    base_notes: ["Amber", "Musk", "Sandalwood"],
    stock_quantity: 50,
    featured: true,
    image_url: product1,
  },
  {
    id: "2",
    name: "Blackiss – Noir Absolu",
    slug: "blackiss-noir-absolu",
    category: "black-kiss",
    price: 38000,
    volume_ml: 80,
    gender: "men",
    short_description: "Dark, mysterious, and unapologetically bold.",
    long_description: "Blackiss – Noir Absolu embodies the essence of nocturnal sophistication. A daring composition that opens with smoky incense and leather, transitioning into a heart of black orchid and vetiver. The base is an intoxicating blend of benzoin, tonka bean, and dark amber.",
    top_notes: ["Incense", "Leather", "Cardamom"],
    middle_notes: ["Black Orchid", "Vetiver", "Iris"],
    base_notes: ["Benzoin", "Tonka Bean", "Dark Amber"],
    stock_quantity: 35,
    featured: true,
    image_url: product2,
  },
  {
    id: "3",
    name: "Royal Touch – Imperial Crown",
    slug: "royal-touch-imperial-crown",
    category: "royal-touch",
    price: 55000,
    volume_ml: 100,
    gender: "unisex",
    short_description: "Regal elegance inspired by Ottoman grandeur.",
    long_description: "Royal Touch – Imperial Crown is a tribute to Turkish royal heritage. This opulent fragrance features rare Turkish rose absolute, precious oud from the finest agarwood, and a majestic base of gold-infused amber. Every spray is a coronation of the senses.",
    top_notes: ["Turkish Rose", "Pink Pepper", "Elemi"],
    middle_notes: ["Oud Absolute", "Orris", "Cinnamon"],
    base_notes: ["Gold Amber", "Musk", "Cedarwood"],
    stock_quantity: 25,
    featured: true,
    image_url: product3,
  },
  {
    id: "4",
    name: "Holigan – Street Royale",
    slug: "holigan-street-royale",
    category: "holigan",
    price: 32000,
    volume_ml: 75,
    gender: "men",
    short_description: "Urban edge meets luxury craftsmanship.",
    long_description: "Holigan – Street Royale breaks convention with its rebellious spirit. A daring fusion of metallic aldehydes and fresh citrus bursts opens into a heart of suede and geranium. The base anchors with patchouli, cashmeran, and a whisper of smoke. For the modern man who makes his own rules.",
    top_notes: ["Aldehydes", "Lemon", "Grapefruit"],
    middle_notes: ["Suede", "Geranium", "Lavender"],
    base_notes: ["Patchouli", "Cashmeran", "Smoky Accord"],
    stock_quantity: 60,
    featured: true,
    image_url: product4,
  },
  {
    id: "5",
    name: "Saria 69 – Velvet Dusk",
    slug: "saria-69-velvet-dusk",
    category: "saria-69",
    price: 42000,
    volume_ml: 100,
    gender: "women",
    short_description: "Feminine mystique wrapped in Turkish silk.",
    long_description: "Velvet Dusk is the feminine counterpart in the Saria 69 collection. A seductive opening of peach blossom and mandarin leads into a lush heart of tuberose and ylang-ylang. The velvety base of vanilla, white musk, and precious woods creates an unforgettable sillage.",
    top_notes: ["Peach Blossom", "Mandarin", "Raspberry"],
    middle_notes: ["Tuberose", "Ylang-Ylang", "Magnolia"],
    base_notes: ["Vanilla", "White Musk", "Sandalwood"],
    stock_quantity: 40,
    featured: false,
    image_url: product1,
  },
  {
    id: "6",
    name: "Blackiss – Shadow Silk",
    slug: "blackiss-shadow-silk",
    category: "black-kiss",
    price: 36000,
    volume_ml: 80,
    gender: "women",
    short_description: "The dark feminine. Powerful and unforgettable.",
    long_description: "Shadow Silk wraps the wearer in an aura of dark femininity. Opening with black cherry and dark plum, it reveals a heart of night-blooming jasmine and violet leaf. The base is a luxurious blend of cashmere wood, vanilla absolute, and labdanum.",
    top_notes: ["Black Cherry", "Dark Plum", "Pink Pepper"],
    middle_notes: ["Night Jasmine", "Violet Leaf", "Rose Absolute"],
    base_notes: ["Cashmere Wood", "Vanilla Absolute", "Labdanum"],
    stock_quantity: 30,
    featured: false,
    image_url: product2,
  },
  {
    id: "7",
    name: "Royal Touch – Sultan's Garden",
    slug: "royal-touch-sultans-garden",
    category: "royal-touch",
    price: 52000,
    volume_ml: 100,
    gender: "unisex",
    short_description: "A fragrant journey through an Ottoman palace garden.",
    long_description: "Sultan's Garden transports you to the lush gardens of Topkapi Palace. Rare Turkish rose, fresh fig, and aromatic herbs create a green, floral opening. The heart blooms with orange blossom and neroli, while the base of aged oud, frankincense, and honey creates a timeless finish.",
    top_notes: ["Turkish Rose", "Fig", "Basil"],
    middle_notes: ["Orange Blossom", "Neroli", "Saffron"],
    base_notes: ["Aged Oud", "Frankincense", "Honey"],
    stock_quantity: 20,
    featured: false,
    image_url: product3,
  },
  {
    id: "8",
    name: "Holigan – Chrome Edge",
    slug: "holigan-chrome-edge",
    category: "holigan",
    price: 30000,
    volume_ml: 75,
    gender: "unisex",
    short_description: "Sharp, clean, cutting-edge luxury.",
    long_description: "Chrome Edge is the modern minimalist of the Holigan collection. A crisp opening of frozen mint and metallic iris meets a heart of violet leaf and white pepper. The base of white woods, ambroxan, and clean musk creates a futuristic, skin-scent finish that feels like liquid chrome.",
    top_notes: ["Frozen Mint", "Metallic Iris", "Ozone"],
    middle_notes: ["Violet Leaf", "White Pepper", "Sea Salt"],
    base_notes: ["White Woods", "Ambroxan", "Clean Musk"],
    stock_quantity: 45,
    featured: false,
    image_url: product4,
  },
];

export function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
