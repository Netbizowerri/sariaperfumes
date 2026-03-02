import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AboutPreviewSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">About Saria</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Be Unique With Saria Perfume
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
              From the heart of Ankara’s ateliers, we blend Oud, citrus, and velvet woods into
              fragrances that feel at once deeply personal and unmistakably luxurious. Each bottle
              is curated for people who live boldly—designed to accentuate every season, every
              milestone.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Join our ambassador circle, explore scented narratives, and rediscover how fragrance
              can become your signature.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.3em] border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Discover Our Story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-[32px] border border-border bg-card shadow-[0_20px_45px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
              <div className="relative h-0" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  title="Saria Perfumes Preview"
                  src="https://www.youtube.com/embed/gyrfPuC9KfI?rel=0&modestbranding=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-none"
                />
              </div>
              <div className="px-6 py-5 bg-background/70 backdrop-blur-sm border-t border-border">
                <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">
                  Behind the scenes
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground mt-2">
                  Saria Perfume in motion
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Watch the craftsmanship, textures, and scent inspirations that define our maison.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
