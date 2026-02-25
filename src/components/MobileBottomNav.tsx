import { Link, useLocation } from "react-router-dom";
import { Home, Store, LayoutGrid, MessageCircle } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/#categories", label: "Categories", icon: LayoutGrid },
  { to: "/distributor", label: "Chat", icon: MessageCircle },
];

export default function MobileBottomNav() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/#categories") return false;
    return location.pathname === to;
  };

  const handleClick = (to: string) => {
    if (to === "/#categories") {
      const el = document.getElementById("categories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return item.to === "/#categories" ? (
            <button
              key={item.to}
              onClick={() => handleClick(item.to)}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 group"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 group-active:scale-90 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 group"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 group-active:scale-90 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
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
