import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Lock, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
      toast.success("Login successful");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Could not sign in. Check your admin credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(43_56%_42%/.22),transparent_42%),radial-gradient(circle_at_bottom_right,hsl(43_56%_42%/.10),transparent_40%)]" />
      <div className="absolute inset-0 opacity-40 [background-size:24px_24px] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]" />

      <div className="relative container mx-auto px-6 py-14 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md border border-border bg-card p-8 md:p-10 shadow-xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs tracking-[0.35em] uppercase text-primary mb-2">Admin Portal</p>
            <h1 className="font-display text-3xl font-bold">Saria Control Center</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Admin Email
              </label>
              <div className="flex items-center gap-3 border border-border bg-background px-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  placeholder="admin@saria.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Password
              </label>
              <div className="flex items-center gap-3 border border-border bg-background px-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 text-sm uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing In..." : "Login"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
