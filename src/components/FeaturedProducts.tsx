import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Curated Selection</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Featured <span className="text-gold-gradient">Collection</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/shop"
            className="inline-block border border-border text-foreground px-8 py-3 text-sm tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-all duration-300"
          >
            View All Fragrances
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
