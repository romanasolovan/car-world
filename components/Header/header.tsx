"use client";

import React, { useState, useEffect } from "react";
import css from "./header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import FavoritesModal from "@/components/Favorites/Favorites";
import MobileNav from "../MobileNav/MobileNav";

function Header() {
  const pathname = usePathname();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Update favorites count when localStorage changes
  useEffect(() => {
    const updateFavoritesCount = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("favorites");
        if (saved) {
          try {
            const favorites = JSON.parse(saved);
            setFavoritesCount(Array.isArray(favorites) ? favorites.length : 0);
          } catch {
            setFavoritesCount(0);
          }
        } else {
          setFavoritesCount(0);
        }
      }
    };

    // Initial count
    updateFavoritesCount();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favorites") {
        updateFavoritesCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events (when favorites change in same tab)
    const handleFavoritesChange = () => updateFavoritesCount();
    window.addEventListener("favoritesChanged", handleFavoritesChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
    };
  }, []);

  const openFavorites = () => {
    setIsFavoritesOpen(true);
  };

  const closeFavorites = () => {
    setIsFavoritesOpen(false);
  };

  return (
    <>
      <header className={css.header}>
        <div className={css.inner}>
          {/* LEFT: Logo */}
          <div className={css.left}>
            <Link href="/" aria-label="Home">
              <svg width={104} height={16}>
                <use href="/logo.svg" />
              </svg>
            </Link>
          </div>

          {/* RIGHT: Navigation + Favorites visible always + Burger only on mobile */}
          <div className={css.right}>
            <nav className={css.desktopNav} aria-label="Main Navigation">
              <ul className={css.navigation}>
                <li className={css.links}>
                  <Link
                    href="/"
                    className={`${css.homelink} ${
                      pathname === "/" ? css.active : ""
                    }`}
                  >
                    Home
                  </Link>

                  <Link
                    href="/catalog"
                    className={`${css.cataloglink} ${
                      pathname === "/catalog" ? css.active : ""
                    }`}
                  >
                    Catalog
                  </Link>
                </li>
              </ul>
            </nav>
            <button
              className={css.favoritesBtn}
              onClick={openFavorites}
              aria-label={`Open favorites (${favoritesCount} items)`}
            >
              <div className={css.heartContainer}>
                <Image
                  src={
                    favoritesCount > 0
                      ? "/active-heart.svg"
                      : "/favorites-heart.svg"
                  }
                  alt="Favorites"
                  width={20}
                  height={18}
                  className={css.heartIcon}
                />
                {favoritesCount > 0 && (
                  <span className={css.favoritesCount}>{favoritesCount}</span>
                )}
              </div>
            </button>

            {/* Mobile burger component */}
            <MobileNav pathname={pathname} />
          </div>
        </div>
      </header>

      <FavoritesModal isOpen={isFavoritesOpen} onClose={closeFavorites} />
    </>
  );
}

export default Header;
