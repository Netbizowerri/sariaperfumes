import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductsData } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { brandHierarchy } from "@/data/brandStructure";
import { genderOptions, subCategoryDefaults } from "@/data/categoryConfig";

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

export default function ShopPage() {
  const { products, loading, error } = useProductsData();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const isCategoryBrand = Boolean(
    categoryParam && brandHierarchy.some((brand) => brand.slug === categoryParam),
  );
  const initialBrand = searchParams.get("brand") || (isCategoryBrand ? categoryParam : "all");
  const initialSubCategory =
    searchParams.get("subcategory") ?? (isCategoryBrand ? "all" : categoryParam ?? "all");
  const initialGender = searchParams.get("gender") ?? "all";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brandSlug === selectedBrand);
    }
    if (selectedSubCategory !== "all") {
      result = result.filter((p) => p.category === selectedSubCategory);
    }
    if (selectedGender !== "all") {
      result = result.filter((p) => p.gender === selectedGender);
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [products, selectedBrand, selectedSubCategory, selectedGender, sortBy]);

  const updateParams = (updates: Partial<Record<"brand" | "subcategory" | "gender", string>>) => {
    const nextParams = new URLSearchParams(searchParams);
    if ("brand" in updates) {
      if (updates.brand === "all") nextParams.delete("brand");
      else nextParams.set("brand", updates.brand);
      nextParams.delete("category");
    }
    if ("subcategory" in updates) {
      if (updates.subcategory === "all") nextParams.delete("subcategory");
      else nextParams.set("subcategory", updates.subcategory);
    }
    if ("gender" in updates) {
      if (updates.gender === "all") nextParams.delete("gender");
      else nextParams.set("gender", updates.gender);
    }
    setSearchParams(nextParams);
  };

  const handleBrandChange = (brandSlug: string) => {
    setSelectedBrand(brandSlug);
    setSelectedSubCategory("all");
    updateParams({ brand: brandSlug, subcategory: "all" });
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    updateParams({ subcategory: subCategory });
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    updateParams({ gender });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Our Collections</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            The <span className="text-gold-gradient">Boutique</span>
          </h1>
        </motion.div>

        <div className="flex flex-col gap-6 mb-12 pb-6 border-b border-border">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBrandChange("all")}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                selectedBrand === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              All Brands
            </button>
            {brandHierarchy.map((brand) => (
              <button
                key={brand.slug}
                onClick={() => handleBrandChange(brand.slug)}
                className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  selectedBrand === brand.slug
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1 flex-wrap">
              {genderOptions.map((gender) => (
                <button
                  key={gender.id}
                  onClick={() => handleGenderChange(gender.id)}
                  className={`px-3 py-1 text-xs uppercase transition-all duration-300 ${
                    selectedGender === gender.id
                      ? "text-primary border-b border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {gender.shortLabel}
                </button>
              ))}
            </div>

            <select
              value={selectedSubCategory}
              onChange={(event) => handleSubCategoryChange(event.target.value)}
              className="bg-input border border-border px-3 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All subcategories</option>
              {subCategoryDefaults.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="bg-input border border-border px-3 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">Loading fragrances...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="text-center py-6 text-sm uppercase tracking-[0.2em] text-destructive">
                <p>{error}</p>
                <p>Showing cached catalog while we wait for Firestore.</p>
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No fragrances match your selection.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
