import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Quick Add */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              navigate("/cart");
            }}
            className="absolute bottom-4 left-4 right-4 bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] md:text-xs text-primary tracking-[0.3em] uppercase mb-1">
            {product.category.replace("-", " ")}
          </p>
          <h3 className="text-sm md:text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">{product.short_description}</p>
          <div className="flex items-center justify-between mt-2 md:mt-3">
            <span className="text-primary text-sm md:text-lg font-semibold">{formatPrice(product.price)}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground">{product.volume_ml}ml</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
