import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/data/products";
import catSaria69 from "@/assets/cat-saria69.png";
import catBlackKiss from "@/assets/cat-blackkiss.png";
import catRoyalTouch from "@/assets/cat-royaltouch.png";
import catHoligan from "@/assets/cat-holigan.jpg";

const categoryImages: Record<string, string> = {
  "saria-69": catSaria69,
  "black-kiss": catBlackKiss,
  "royal-touch": catRoyalTouch,
  "holigan": catHoligan,
};

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clone items for infinite scroll: [...items, ...items, ...items]
  const infiniteCategories = [...categories, ...categories, ...categories];

  // Start in the middle set so user can scroll both directions
  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / 3;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 3;

    // If scrolled past the end of the middle set, jump back to middle
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    }
    // If scrolled before the start of the middle set, jump forward to middle
    if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -220 : 220;
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
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-6 snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {infiniteCategories.map((cat, i) => (
              <div
                key={`${cat.id}-${i}`}
                className="snap-center shrink-0"
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="flex flex-col items-center gap-4 min-w-[180px] md:min-w-[250px] group"
                >
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-border group-hover:border-primary transition-all duration-500 flex items-center justify-center bg-card group-hover:bg-primary/5 overflow-hidden p-4">
                    <img
                      src={categoryImages[cat.slug]}
                      alt={cat.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-medium tracking-[0.15em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
