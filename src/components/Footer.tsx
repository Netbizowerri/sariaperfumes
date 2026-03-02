import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";
import logoImg from "@/assets/logo.jpeg";

const NEWSLETTER_ENDPOINT = "https://formspree.io/f/xgoldznr";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "success">(
    "idle",
  );

  const isSendingNewsletter = newsletterStatus === "sending";

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("sending");
    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: newsletterEmail,
          subject: "Saria Perfumes Newsletter",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to join newsletter at this time.");
      }

      setNewsletterStatus("success");
      setNewsletterEmail("");
      toast.success("You're on the list!");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
      setNewsletterStatus("idle");
      toast.error("Could not subscribe. Please try again.");
    }
  };

  return (
    <footer className="bg-card border-t border-border pb-20 md:pb-0">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <img src={logoImg} alt="Saria Perfume" className="h-18 w-auto mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium Turkish Designer Perfumes. Makers of Jutenya Niche Series, Blackiss Series & Royal Touch Series.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/distributor", label: "Become a Distributor" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:08039201119" className="hover:text-primary transition-colors">
                  08039201119
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@sariaperfumes.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Abuja · Lagos · Southeast Nigeria</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                Follow
              </span>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@SariaPerfume"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="min-w-0">
            <h4 className="font-display text-lg text-foreground mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get exclusive offers and new collection updates.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-full overflow-hidden rounded-md border border-border"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={isSendingNewsletter}
                className="bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-gold-light transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSendingNewsletter ? "Joining..." : "Join"}
              </button>
            </form>
            {newsletterStatus === "success" && (
              <p className="text-xs text-primary mt-2">Thank you! We will keep you posted.</p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Saria Perfumes. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Premium Turkish Designer Perfumes
          </p>
        </div>
      </div>
    </footer>
  );
}
