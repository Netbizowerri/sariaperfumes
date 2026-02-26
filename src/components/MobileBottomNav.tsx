import { Link, useLocation } from "react-router-dom";
import { Home, Store, UserPlus, MessageCircle } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/distributor", label: "Join Us", icon: UserPlus },
  { to: "/contact", label: "Contact", icon: MessageCircle },
];

export default function MobileBottomNav() {
  const location = useLocation();

  const isActive = (to: string) => {
    return location.pathname === to;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <nav className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 group"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 group-active:scale-90 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-semibold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
