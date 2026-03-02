import { genderOptions, subCategoryDefaults } from "@/data/categoryConfig";
import { normalizeSlug } from "@/lib/slug";

export interface BrandGenderGroup {
  id: string;
  label: string;
  subcategories: { label: string; slug: string }[];
}

export interface BrandGroup {
  name: string;
  slug: string;
  logoUrl?: string;
  genders: BrandGenderGroup[];
}

type BrandLogo = {
  [key: string]: string;
};

const brandLogos: BrandLogo = {
  "saria-69": "https://i.ibb.co/q38vx8Kf/sas.png",
  holigan: "https://i.ibb.co/YTFScsbT/sas4.jpg",
  "royal-touch": "https://i.ibb.co/yFTZYNx2/sas3.png",
  "black-kiss": "https://i.ibb.co/N5vgz0h/sas2.png",
};

const brandNames = ["Saria 69", "Holigan", "Royal Touch", "Black Kiss", "Jutenya"];

export const brandHierarchy: BrandGroup[] = brandNames.map((brand) => {
  const slug = normalizeSlug(brand);
  return {
    name: brand,
    slug,
    logoUrl: brandLogos[slug],
    genders: genderOptions.map((gender) => ({
      id: gender.id,
      label: gender.label,
      subcategories: subCategoryDefaults.map((category) => ({
        label: category.name,
        slug: category.slug,
      })),
    })),
  };
});

export const brandList = brandHierarchy.map((brand) => ({
  name: brand.name,
  slug: brand.slug,
}));
