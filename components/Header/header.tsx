"use client";

import React from "react";
import css from "./header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        <svg width={104} height={16}>
          <use href="/logo.svg" />
        </svg>
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.links}>
            <Link
              href="/"
              className={`${css.homelink} 
              ${pathname === "/" ? css.active : ""} `}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={`${css.cataloglink}
              ${pathname === "/catalog" ? css.active : ""} `}
            >
              Catalog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
