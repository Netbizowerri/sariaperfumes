import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function DistributorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    location: "",
    shop_address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/maqdvbpe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          location: form.location,
          shop_address: form.shop_address,
          subject: "Distributor Application",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to submit your application.");
      }

      setSubmitted(true);
      toast.success("Application submitted! We'll contact you shortly.");
    } catch (error) {
      console.error(error);
      toast.error("We couldn't submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    "Premium branded shop setup",
    "Exclusive territory allocation",
    "Marketing materials & support",
    "Competitive wholesale pricing",
    "Training & product knowledge",
    "Priority access to new releases",
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Business Opportunity</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Become a Premium{" "}
            <span className="text-gold-gradient">Saria Distributor</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join our growing network of premium fragrance distributors across Nigeria. 
            We provide full branding, marketing support, and exclusive territory rights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl mb-8">Why Partner With Saria?</h2>
            <div className="space-y-4 mb-10">
              {benefits.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{b}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 p-6 border border-border">
              <h3 className="font-display text-lg">Current Locations</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Abuja · Lagos · Southeast Nigeria
              </div>
              <p className="text-sm text-muted-foreground">
                We are <span className="text-primary">expanding nationwide</span> — new territories opening regularly.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:08039201119" className="text-foreground hover:text-primary transition-colors font-medium">
                  Call 08039201119
                </a>
              </div>
              <p className="text-xs text-muted-foreground">For distributorship terms & conditions</p>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center text-center p-8 border border-primary/30">
                <div>
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="font-display text-2xl mb-3">Application Submitted!</h3>
                  <p className="text-muted-foreground">
                    Thank you for your interest. Our team will review your application and contact you within 48 hours.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-border">
                <h2 className="font-display text-2xl mb-6">Apply Now</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                      Location / City *
                    </label>
                    <input
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g., Lagos, Abuja, Enugu"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                      Shop Address (if applicable)
                    </label>
                    <textarea
                      value={form.shop_address}
                      onChange={(e) => setForm({ ...form, shop_address: e.target.value })}
                      rows={3}
                      className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Enter your shop address"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 luxury-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Application"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
