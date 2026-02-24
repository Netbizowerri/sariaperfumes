import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

export default function DistributorCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-xs tracking-[0.4em] uppercase mb-3"
          >
            Business Opportunity
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Become a Premium{" "}
            <span className="text-gold-gradient">Saria Distributor</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join our growing network of premium distributors in Abuja, Lagos, and Southeast Nigeria. We brand shops for our premium partners and provide full marketing support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/distributor"
              className="bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 flex items-center gap-2 luxury-shadow"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:08039201119"
              className="border border-border text-foreground px-8 py-4 text-sm font-medium tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> 08039201119
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
