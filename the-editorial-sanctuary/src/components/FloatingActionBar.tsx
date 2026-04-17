import { useState } from "react";
import {
  Highlighter,
  ShoppingCart,
  Heart,
} from "lucide-react";
import type { AppPage } from "../types/navigation";

type NavItem = {
  id: AppPage;
  icon: typeof Highlighter;
  label: string;
};

const MOBILE_ITEMS: NavItem[] = [
  { id: "reader", icon: Highlighter, label: "Reader" },
  { id: "wishlist", icon: ShoppingCart, label: "Cart" },
  { id: "personal-library", icon: Heart, label: "Wishlist" },
];

export default function FloatingActionBar({
  currentPage,
  onNavigate,
  isAuthenticated,
}: {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isAuthenticated: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isAuthenticated
    ? MOBILE_ITEMS
    : MOBILE_ITEMS.filter((item) => item.id === "reader");

  return (
    <>
      {isAuthenticated ? (
      <div className="fixed inset-x-0 bottom-0 z-[100] md:hidden">
        <nav
          className="flex items-center justify-around gap-2 border-t border-outline-variant/25 bg-background/95 px-2 pt-2 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md"
          style={{
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
          }}
          aria-label="Quick navigation"
        >
          {visibleItems.map(({ id, icon: Icon, label }) => {
            const active = currentPage === id;
            return (
              <button
                key={id}
                type="button"
                aria-label={label}
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(id)}
                className={`flex min-h-12 min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-primary hover:bg-surface-container-high"
                }`}
              >
                <Icon className="h-6 w-6 shrink-0" aria-hidden />
                <span className="max-w-[4.5rem] truncate text-center text-[9px] font-bold uppercase tracking-wider">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      ) : null}
    </>
  );
}
