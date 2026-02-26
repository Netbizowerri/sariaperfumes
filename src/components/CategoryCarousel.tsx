import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/data/products";

const categoryImages: Record<string, string> = {
  "saria-69": "S69",
  "black-kiss": "BK",
  "royal-touch": "RT",
  "holigan": "HLG",
};

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
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
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-background/80 border border-border hover:border-primary transition-colors rounded-full -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-background/80 border border-border hover:border-primary transition-colors rounded-full -mr-2"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-6 snap-x snap-mandatory justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="snap-center"
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="flex flex-col items-center gap-4 min-w-[200px] md:min-w-[250px] group"
                >
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-border group-hover:border-primary transition-all duration-500 flex items-center justify-center bg-card group-hover:bg-primary/5">
                    <span className="text-3xl md:text-4xl font-bold text-primary/60 group-hover:text-primary transition-colors duration-300 tracking-wider">
                      {categoryImages[cat.slug]}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-medium tracking-[0.15em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
