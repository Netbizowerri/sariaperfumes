import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Home, Store, Users, Info, Phone, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logoImg from "@/assets/logo.jpeg";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/about", label: "About", icon: Info },
  { to: "/distributor", label: "Distributors", icon: Users },
  { to: "/contact", label: "Contact", icon: Phone },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-6 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="Saria Perfume" className="h-12 lg:h-14 w-auto" />
          <span className="font-display font-bold uppercase text-foreground text-sm tracking-[0.12em] md:text-lg md:tracking-[0.15em] lg:text-xl">
            Saria Perfumes
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-body tracking-widest uppercase transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="relative text-foreground hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - App-like tray */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 top-16 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50"
            >
              <nav className="flex flex-col p-3 gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted active:bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1 text-sm font-medium tracking-wide">
                        {link.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  );
                })}

                {/* Cart in mobile menu */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/cart");
                  }}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-foreground hover:bg-muted active:bg-muted transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium tracking-wide">
                    Cart
                  </span>
                  {totalItems > 0 && (
                    <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
