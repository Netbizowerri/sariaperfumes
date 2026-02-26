import { normalizeSlug } from "@/lib/slug";

export const subCategoryNames = [
  "Woody & Spicy",
  "Spicy",
  "Flowery",
  "Flowery & Fruity",
  "Spicy & Woody",
  "Oriental",
  "Woody",
  "Fresh",
];

export const subCategoryDefaults = subCategoryNames.map((label) => ({
  slug: normalizeSlug(label),
  name: label,
}));

export const genderOptions = [
  { id: "men", label: "Men's Perfume", shortLabel: "Men" },
  { id: "women", label: "Women's Perfume", shortLabel: "Women" },
  { id: "unisex", label: "Unisex Perfume", shortLabel: "Unisex" },
];
