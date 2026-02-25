import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const genders = ["all", "men", "women", "unisex"] as const;
const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
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
  }, [selectedCategory, selectedGender, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
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

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            {/* Gender */}
            <div className="flex gap-1">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 text-xs uppercase transition-all duration-300 ${
                    selectedGender === g
                      ? "text-primary border-b border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">No fragrances match your selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
