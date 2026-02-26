import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="font-display text-3xl mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Browse our collections and find your signature scent.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Your Cart ({totalItems})
            </h1>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 md:gap-6 p-4 border border-border bg-card"
            >
              <Link to={`/product/${item.product.slug}`} className="shrink-0">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.product.slug}`}>
                    <h3 className="font-display text-sm md:text-lg font-medium hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{item.product.volume_ml}ml</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border border-border p-6 bg-card mb-6">
          <h3 className="font-display text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-primary text-xs">Payment on Delivery</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-4 md:pb-4 pb-20">
        <div className="container mx-auto px-6">
          <Link
            to="/checkout"
            className="block w-full bg-primary text-primary-foreground text-center py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-colors luxury-shadow"
          >
            Proceed to Checkout — {formatPrice(totalAmount)}
          </Link>
        </div>
      </div>
    </div>
  );
}
