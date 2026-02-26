import { normalizeSlug } from "@/lib/slug";
import { subCategoryDefaults } from "@/data/categoryConfig";

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
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
  scent_profile: string[];
}

export type ProductInput = Omit<Product, "id">;

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

const categoryLabelOverrides = subCategoryDefaults.reduce<Record<string, string>>(
  (map, category) => {
    map[category.slug] = category.name;
    return map;
  },
  {},
);

export const emptyProductInput: ProductInput = {
  name: "",
  slug: "",
  brand: "",
  brandSlug: "",
  category: "",
  price: 0,
  volume_ml: 100,
  gender: "unisex",
  short_description: "",
  long_description: "",
  top_notes: [],
  middle_notes: [],
  base_notes: [],
  stock_quantity: 0,
  featured: false,
  image_url: "",
  scent_profile: [],
};

export function formatPrice(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
}

export function slugToLabel(slug: string): string {
  if (!slug) return "Uncategorized";

  if (categoryLabelOverrides[slug]) {
    return categoryLabelOverrides[slug];
  }

  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export { normalizeSlug };
