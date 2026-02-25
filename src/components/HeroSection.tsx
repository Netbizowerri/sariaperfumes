import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Saria Perfumes luxury fragrance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/90 to-[#0B0B0B]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/60" />
      </div>

      <div className="relative container mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gold-light text-sm tracking-[0.4em] uppercase mb-6"
          >
            Premium Turkish Designer Perfumes
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[0.95] mb-8 text-white"
          >
            Experience{" "}
            <span className="text-gold-gradient-light">Turkish Luxury</span>{" "}
            in Every Drop
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/70 text-lg md:text-xl max-w-lg mb-10 font-light leading-relaxed"
          >
            Discover the art of Turkish niche perfumery with Saria's exclusive collections — crafted for those who demand the extraordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/shop"
              className="bg-gold text-[#0B0B0B] px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 luxury-shadow"
            >
              Shop Now
            </Link>
            <Link
              to="/distributor"
              className="border border-gold text-gold px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold hover:text-[#0B0B0B] transition-all duration-300"
            >
              Become a Distributor
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent" />
      </motion.div>
    </section>
  );
}
