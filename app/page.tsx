import React from "react";
import css from "./page.module.css";
import Link from "next/link";

// background image needs to be fixed along with the hero info + what needs to be fixed in header - image reltice and position with absolute
// adding favorites to header

export default function HomePage() {
  return (
    <main className={css.banner}>
      <div className={css.heroinfo}>
        <h1 className={css.title}>Find your perfect rental car</h1>
        <p className={css.subtitle}>
          Reliable and budget-friendly rentals for any journey
        </p>
        <Link href={"/catalog"} className={css.btn}>
          View Catalog
        </Link>
      </div>
    </main>
  );
}
