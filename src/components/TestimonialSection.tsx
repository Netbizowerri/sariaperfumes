import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Chioma A.",
    location: "Lagos",
    text: "Saria 69 is absolutely divine. I've never received so many compliments. The longevity is incredible — I can still smell it the next day.",
    rating: 5,
  },
  {
    name: "Ibrahim K.",
    location: "Abuja",
    text: "As a Saria distributor, I can confidently say these are the finest Turkish perfumes in Nigeria. My customers keep coming back for more.",
    rating: 5,
  },
  {
    name: "Amara O.",
    location: "Enugu",
    text: "Royal Touch – Imperial Crown is the epitome of luxury. It's become my signature scent. Worth every naira.",
    rating: 5,
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            What Our <span className="text-gold-gradient">Clients</span> Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 border border-border hover:border-primary/30 transition-colors duration-500"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
