"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import css from "./MobileNav.module.css";
import { Menu, X } from "lucide-react";

type Props = {
  pathname: string;
};

export default function MobileNav({ pathname }: Props) {
  const [open, setOpen] = useState(false);

  // close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock scroll while menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Burger button (mobile only via CSS) */}
      <button
        type="button"
        className={css.burgerBtn}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        aria-controls="mobile-menu"
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <div
        className={`${css.overlay} ${open ? css.overlayOpen : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <nav
        id="mobile-menu"
        className={`${css.drawer} ${open ? css.drawerOpen : ""}`}
        aria-label="Mobile Navigation"
      >
        <div className={css.drawerHeader}>
          <span className={css.drawerTitle}>Menu</span>
          <button
            className={css.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className={css.drawerNav}>
          <Link
            href="/"
            className={`${css.link} ${pathname === "/" ? css.active : ""}`}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/catalog"
            className={`${css.link} ${
              pathname === "/catalog" ? css.active : ""
            }`}
            onClick={() => setOpen(false)}
          >
            Catalog
          </Link>
        </div>
      </nav>
    </>
  );
}
