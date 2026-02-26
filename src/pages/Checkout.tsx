import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalAmount, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">No Items to Checkout</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-display text-3xl mb-3">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. You will pay on delivery.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            We will contact you on the phone number provided to confirm your order and delivery details.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
    toast.success("Order placed successfully!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Delivery Info Form */}
          <div>
            <h2 className="font-display text-xl mb-6">Delivery Information</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                  Full Name *
                </label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., 08039201119"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                  Delivery Address *
                </label>
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Enter your full delivery address"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                  City *
                </label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Lagos, Abuja"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                  Order Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Any special instructions"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="font-display text-xl mb-6">Order Summary</h2>
            <div className="border border-border p-6 bg-card space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="text-primary text-xs font-medium">Pay on Delivery</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 luxury-shadow mt-4"
              >
                Place Order — Pay on Delivery <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
