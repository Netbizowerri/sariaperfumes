import { motion } from "framer-motion";
import { Sparkles, Award, Globe, Heart } from "lucide-react";

const values = [
  {
    icon: Sparkles,
    title: "Turkish Artistry",
    description:
      "Each fragrance is meticulously crafted by master perfumers in Turkey, using the finest raw materials sourced globally.",
  },
  {
    icon: Award,
    title: "Niche Excellence",
    description:
      "Our niche collections — Jutenya, Blackiss, and Royal Touch — represent the pinnacle of designer perfumery.",
  },
  {
    icon: Globe,
    title: "Growing Nationwide",
    description:
      "From Abuja, Lagos, and Southeast Nigeria, we are expanding across the nation — bringing luxury to every doorstep.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "We believe every customer deserves a premium experience — from first discovery to lasting impression.",
  },
];

const videos = [
  {
    title: "Saria Perfume Brand Story",
    url: "https://www.youtube.com/embed/IlGUzF70Ajk",
  },
  {
    title: "Saria Perfume Ambassador Reel",
    url: "https://www.youtube.com/embed/rHxD7O3AqEQ",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 space-y-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] border border-border">
          <div className="absolute inset-0">
            <img
              src="https://i.ibb.co/qYKdZx8N/Saria-Perfume-1.jpg"
              alt="Saria Perfume House"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B]/85 via-[#0B0B0B]/50 to-transparent" />
          </div>

          <div className="relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl text-white px-4 sm:px-6 md:px-10 lg:px-16"
            >
              <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Our Story</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
                The House of <span className="text-gold-gradient">Saria</span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                Saria Perfumes is Nigeria's premier destination for Turkish designer fragrances. We
                bring the opulence and craftsmanship of Istanbul's finest perfume houses to discerning
                Nigerians who appreciate the art of scent.
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                Our maison celebrates bold personalities with fragrances that move beyond trends and
                linger in memory long after the room has emptied.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-4xl mx-auto mb-20 p-8 md:p-12 border border-border text-center"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Our Mission</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Redefining Luxury Fragrance in Africa
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We are on a mission to make world-class Turkish perfumery accessible across Nigeria and
            beyond. Through our network of premium distributors, branded retail experiences, and an
            unwavering commitment to quality, Saria is building the future of luxury fragrance on the
            continent.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-8 border border-border hover:border-primary/30 transition-colors duration-500 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 border border-primary/30 mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-3">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Videos */}
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">In Motion</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Visual Stories That Define Our Maison
            </h2>
            <p className="text-muted-foreground mt-4">
              Dive into the atmospheres, faces, and fragrances that make Saria Perfumes an
              unforgettable experience.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <motion.div
                key={video.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-[32px] border border-border bg-card overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.15)]"
              >
                <div className="relative h-0" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-none"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience the textures, rituals, and philosophy behind each scent.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
