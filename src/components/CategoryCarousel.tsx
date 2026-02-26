import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { brandHierarchy } from "@/data/brandStructure";
import { useProductsData } from "@/context/ProductsContext";

const fallbackLogo = "/placeholder.svg";

export default function CategoryCarousel() {
  const { products } = useProductsData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const infiniteBrands = [...brandHierarchy, ...brandHierarchy, ...brandHierarchy];

  const resolveLogo = (brandSlug: string) => {
    const brandInfo = brandHierarchy.find((brand) => brand.slug === brandSlug);
    if (brandInfo?.logoUrl) return brandInfo.logoUrl;
    return (
      products.find((product) => product.brandSlug === brandSlug)?.image_url ?? fallbackLogo
    );
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    const singleSetWidth = scrollRef.current.scrollWidth / 3;
    scrollRef.current.scrollLeft = singleSetWidth;
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    }
    if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -220 : 220;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="categories" className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Browse By</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Our <span className="text-gold-gradient">Collections</span>
          </h2>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-background/80 border border-border hover:border-primary transition-colors rounded-full -ml-2"
          >
            <span className="sr-only">Previous</span>
            <div className="w-4 h-4 border-t border-l border-foreground rotate-45" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-background/80 border border-border hover:border-primary transition-colors rounded-full -mr-2"
          >
            <span className="sr-only">Next</span>
            <div className="w-4 h-4 border-b border-r border-foreground rotate-45" />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-6 snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {infiniteBrands.map((brand, index) => (
              <Link
                key={`${brand.slug}-${index}`}
                to={`/shop?brand=${brand.slug}`}
                className="snap-center shrink-0 w-[40%] sm:w-[36%] md:w-[30%] lg:w-[22%]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-border overflow-hidden flex items-center justify-center bg-card shadow-lg">
                    <img
                      src={resolveLogo(brand.slug)}
                      alt={brand.name}
                      className="w-3/4 h-3/4 object-contain"
                    />
                  </div>
                  <p className="text-sm uppercase tracking-[0.4em] text-foreground">{brand.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
