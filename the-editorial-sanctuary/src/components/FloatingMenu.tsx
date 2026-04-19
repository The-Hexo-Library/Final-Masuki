import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Globe,
  LayoutGrid,
  BookOpen,
  ShoppingCart,
  Heart,
  type LucideIcon,
} from "lucide-react";
import type { AppPage } from "../types/navigation";

type MenuItem = {
  id: AppPage;
  icon: LucideIcon;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: "landing", icon: Globe, label: "Home" },
  { id: "public-library", icon: LayoutGrid, label: "Public Library" },
  { id: "personal-library", icon: Heart, label: "Personal Library" },
  { id: "cart", icon: ShoppingCart, label: "Cart" },
  { id: "wishlist", icon: BookOpen, label: "Wishlist" },
  { id: "login", icon: Globe, label: "Login" },
  { id: "reader", icon: BookOpen, label: "Reader" },
];

const ADMIN_MENU_ITEMS: MenuItem[] = [
  { id: "landing", icon: Globe, label: "Home" },
  { id: "admin", icon: LayoutGrid, label: "Admin Vault" },
  { id: "admin-add-book", icon: BookOpen, label: "Add Books" },
  { id: "public-library", icon: LayoutGrid, label: "Public Library" },
  { id: "personal-library", icon: Heart, label: "User Stats" },
  { id: "reader", icon: BookOpen, label: "Reader" },
];

function useMdUp() {
  const [md, setMd] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setMd(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return md;
}

const springPanel = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.85 };
const springRow = { type: "spring" as const, stiffness: 400, damping: 26, mass: 0.65 };

const menuListVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075, delayChildren: 0.12 },
  },
} as const;

const menuRowVariants = {
  hidden: { opacity: 0, x: 56 },
  show: {
    opacity: 1,
    x: 0,
    transition: springRow,
  },
};

export default function FloatingMenu({
  currentPage,
  onNavigate,
  isAuthenticated,
  isAdmin,
}: {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isAuthenticated: boolean;
  isAdmin?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleItems = isAuthenticated
    ? (isAdmin ? ADMIN_MENU_ITEMS : MENU_ITEMS).filter((item) => item.id !== "login")
    : MENU_ITEMS.filter((item) => item.id === "landing" || item.id === "login");

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen, close]);

  const handleNavigate = (id: AppPage) => {
    onNavigate(id);
    close();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-menu-backdrop"
            role="presentation"
            aria-hidden
            className="fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <div
        ref={rootRef}
        className="pointer-events-none fixed bottom-28 right-0 z-[110] hidden flex-col items-stretch pl-8 md:flex md:bottom-8 md:pl-12"
      >
        <div className="pointer-events-auto flex flex-col items-end pr-3 md:pr-5">
          <AnimatePresence>
            {isOpen && (
              <motion.nav
                key="menu-panel"
                aria-label="Quick actions"
                className="mb-3 w-[min(85vw,18rem)] origin-bottom-right overflow-hidden rounded-2xl border border-outline-variant/40 border-r-0 bg-surface-container-low/98 py-3 pl-3 pr-5 shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-md"
                initial={{ x: "calc(100% + 24px)", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "calc(100% + 32px)", opacity: 0 }}
                transition={springPanel}
              >
                <motion.ul
                  className="flex flex-col gap-1"
                  initial="hidden"
                  animate="show"
                  variants={menuListVariants}
                >
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = currentPage === item.id;
                    return (
                      <motion.li key={item.id} variants={menuRowVariants}>
                        <button
                          type="button"
                          aria-label={item.label}
                          aria-current={active ? "page" : undefined}
                          onClick={() => handleNavigate(item.id)}
                          className={`flex w-full min-w-[11rem] items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                            active
                              ? "bg-primary text-on-primary"
                              : "text-on-surface hover:bg-surface-container-highest"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" aria-hidden />
                          <span className="truncate">{item.label}</span>
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.nav>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            whileTap={{ scale: 0.92 }}
            className="ml-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-outline-variant/50 bg-primary text-on-primary shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
            onClick={() => setIsOpen((o) => !o)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5, rotate: -120 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <X className="h-6 w-6" aria-hidden />
                </motion.span>
              ) : (
                <motion.span
                  key="kebab"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <Menu className="h-7 w-7" aria-hidden strokeWidth={2.25} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}
