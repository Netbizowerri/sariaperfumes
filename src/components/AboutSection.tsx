import { motion } from "framer-motion";
import { Sparkles, Award, Globe } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Turkish Artistry",
    description: "Each fragrance is meticulously crafted by master perfumers in Turkey, using the finest raw materials sourced from around the world.",
  },
  {
    icon: Award,
    title: "Niche Excellence",
    description: "Our niche collections — Jutenya, Blackiss, and Royal Touch — represent the pinnacle of designer perfumery, exclusive to discerning connoisseurs.",
  },
  {
    icon: Globe,
    title: "Growing Nationwide",
    description: "From our flagship presence in Abuja, Lagos, and Southeast Nigeria, we are expanding across the nation — bringing luxury to every doorstep.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            The House of <span className="text-gold-gradient">Saria</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Saria Perfumes is Nigeria's premier destination for Turkish designer fragrances. We bring the opulence and craftsmanship of Istanbul's finest perfume houses to discerning Nigerians.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-8 border border-border hover:border-primary/30 transition-colors duration-500 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 border border-primary/30 mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
