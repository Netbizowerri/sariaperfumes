import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "08039201119",
    href: "tel:08039201119",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@sariaperfumes.com",
    href: "mailto:info@sariaperfumes.com",
  },
  {
    icon: MapPin,
    label: "Locations",
    value: "Abuja · Lagos · Southeast Nigeria",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/mreajlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: "Website Contact Request",
          message: form.message,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Could not send message.");
      }

      setSubmitted(true);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Unable to send your message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Contact <span className="text-gold-gradient">Saria</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have a question about our fragrances, distributorship, or anything else?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl mb-8">Reach Us</h2>
            <div className="space-y-6 mb-10">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border border-border">
              <h3 className="font-display text-lg mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                <p>Saturday: 10:00 AM – 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center text-center p-8 border border-primary/30">
                <div>
                  <Send className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="font-display text-2xl mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. Our team will respond within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-border">
                <h2 className="font-display text-2xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs text-muted-foreground tracking-[0.15em] uppercase mb-2">
                      Your Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter your name"
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
                      Message *
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 luxury-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"} <ArrowRight className="w-4 h-4" />
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
