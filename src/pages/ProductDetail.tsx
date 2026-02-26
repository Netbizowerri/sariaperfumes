import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { formatPrice, slugToLabel } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { useProductsData } from "@/context/ProductsContext";
import SEO from "@/components/SEO";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { products, categories, loading } = useProductsData();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const categoryLabel =
    categories.find((cat) => cat.slug === product.category)?.name ??
    slugToLabel(product.category);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title={`${product.name} | Saria Perfumes`}
        description={product.short_description}
        path={`/product/${product.slug}`}
        image={product.image_url}
      />
      <div className="container mx-auto px-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-[3/4] bg-card overflow-hidden"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-1">
              {product.brand}
            </p>
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">
              {categoryLabel}
            </p>
            {product.scent_profile.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.scent_profile.map((tag) => (
                  <span
                    key={`${product.slug}-profile-${tag}`}
                    className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] border border-border rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {product.long_description}
            </p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display text-3xl text-primary">{formatPrice(product.price)}</span>
              <span className="text-sm text-muted-foreground">
                {product.volume_ml}ml - {product.gender}
              </span>
            </div>

            <button
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
              className="bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 luxury-shadow w-full md:w-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart - {formatPrice(product.price)}
            </button>

            {product.stock_quantity < 10 && (
              <p className="text-xs text-primary mt-3">
                Only {product.stock_quantity} left in stock
              </p>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl mb-8 text-center">
              You May Also <span className="text-gold-gradient">Love</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
