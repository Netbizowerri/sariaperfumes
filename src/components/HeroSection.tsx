import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const desktopHero = "https://i.ibb.co/dwN5nCSS/Saria-Perfumes-4.jpg";
const mobileHero = "https://i.ibb.co/hxT1TT6Z/Saria-Perfumes-1080-x-1080-px-2.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 ken-burns">
          <picture className="w-full h-full block">
            <source srcSet={desktopHero} media="(min-width: 1024px)" />
            <img
              src={mobileHero}
              alt="Saria Perfumes luxury fragrance"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/75 via-[#0B0B0B]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-[#0B0B0B]/20" />
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
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] mb-8 text-white"
          >
            Pure Turkish <span className="text-gold-gradient">Elegance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="text-base text-white leading-relaxed mb-6 hidden md:block"
          >
            Discover the art of Turkish perfumery with Saria 69, Black Kiss, Royal Touch, and
            Holigan — four signature collections crafted in Istanbul to deliver bold character,
            timeless elegance, and unforgettable presence.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="text-base text-white leading-relaxed mb-6 md:hidden"
          >
            Discover the art of Turkish perfumery with Saria 69, Black Kiss, Royal Touch, and
            Holigan
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-semibold tracking-[0.3em] uppercase border border-white text-white hover:bg-white hover:text-black transition"
            >
              Shop Collection
            </Link>
            <Link
              to="/distributor"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-semibold tracking-[0.3em] uppercase border border-white/40 text-white/90 hover:bg-white/90 hover:text-black transition"
            >
              Become A Distributor
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
