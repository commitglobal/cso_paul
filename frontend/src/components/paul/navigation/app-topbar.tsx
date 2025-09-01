import logo from "@/assets/paul-logo.svg";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * AppTopbar
 * - Mobile-only top bar that hides on scroll down and reappears on scroll up.
 * - Contains the Paul logo that links to the homepage.
 */
export function AppTopbar({ className, ...props }: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef<number>(0);
  const ticking = useRef<boolean>(false);
  const THRESHOLD = 10; // minimal delta to toggle

  useEffect(() => {
    // Initialize last scroll position on mount
    lastScrollY.current = window.scrollY || 0;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY || 0;

        if (currentY <= 0) {
          setVisible(true);
        } else if (currentY > lastScrollY.current + THRESHOLD) {
          // Scrolling down
          setVisible(false);
        } else if (currentY < lastScrollY.current - THRESHOLD) {
          // Scrolling up
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-200",
        visible ? "translate-y-0" : "-translate-y-full",
        className
      )}
      {...props}
    >
      <div className="h-12 flex items-center justify-center px-4">
        <Link href="/" aria-label={t("navigation.home") ?? "Home"}>
          <img src={logo} alt={t("navigation.home") ?? "Home"} className="h-6 w-auto" />
        </Link>
      </div>
    </div>
  );
}
