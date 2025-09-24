"use client";

import React from "react";
import css from "./header.module.css";
import Link from "next/link";

// navigation set up - set page changes color
// the best way to fix logo?

function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        {/* <image href="/logo.svg" /> */}
        <img src="/logo.svg" alt="logo" />
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.links}>
            <Link href="/" className={css.homelink}>
              Home
            </Link>
            <Link href="/catalog" className={css.cataloglink}>
              Catalog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
