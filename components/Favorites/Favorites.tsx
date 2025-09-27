import React, { useEffect, useState } from "react";
import css from "./Favorites.module.css";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types/cars";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// when favorites are removed they also are removed from the car list. fix bug

function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<Car[]>([]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Load favorites from localStorage
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Ensure all items are Car objects with required properties
          const validCars = parsed.filter(
            (item): item is Car =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              "brand" in item &&
              "model" in item
          );
          setFavorites(validCars);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error("Error parsing favorites:", err);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [isOpen]);

  // Listen for favorites changes
  useEffect(() => {
    const handleFavoritesChange = () => {
      if (!isOpen || typeof window === "undefined") return;

      const saved = localStorage.getItem("favorites");
      if (saved) {
        try {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const validCars = parsed.filter(
              (item): item is Car =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                "brand" in item &&
                "model" in item
            );
            setFavorites(validCars);
          } else {
            setFavorites([]);
          }
        } catch (err) {
          console.error("Error parsing favorites:", err);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    };

    window.addEventListener("favoritesChanged", handleFavoritesChange);
    return () =>
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
  }, [isOpen]);

  const handleRemoveFavorite = (carId: string) => {
    // Update favorites array
    const updated = favorites.filter((c) => c.id !== carId);
    setFavorites(updated);

    // Update localStorage with full car objects
    localStorage.setItem("favorites", JSON.stringify(updated));

    // Update favoriteIds array
    const favoriteIds = JSON.parse(localStorage.getItem("favoriteIds") || "[]");
    const updatedIds = favoriteIds.filter((id: string) => id !== carId);
    localStorage.setItem("favoriteIds", JSON.stringify(updatedIds));

    // Dispatch event
    window.dispatchEvent(new Event("favoritesChanged"));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Escape key closes modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay} onClick={handleBackdropClick}>
      <div className={css.modalContent}>
        {/* Header */}
        <div className={css.modalHeader}>
          <h2 className={css.modalTitle}>
            <Image
              src="/active-heart.svg"
              alt="Heart"
              width={20}
              height={18}
              className={css.heartIcon}
            />
            Favorite Cars ({favorites.length})
          </h2>
          <button
            onClick={onClose}
            className={css.closeBtn}
            aria-label="Close favorites"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={css.modalBody}>
          {favorites.length === 0 ? (
            <div className={css.emptyState}>
              <div className={css.emptyIcon}>
                <Image
                  src="/favorites-heart.svg"
                  alt="No favorites"
                  width={48}
                  height={45}
                  className={css.emptyHeartIcon}
                />
              </div>
              <h3 className={css.emptyTitle}>No favorite cars yet</h3>
              <p className={css.emptyMessage}>
                Start adding cars to your favorites and they will appear here
              </p>
              <Link
                href="/catalog"
                className={css.catalogBtn}
                onClick={onClose}
              >
                Choose your favorites from our catalog
              </Link>
            </div>
          ) : (
            <div className={css.favoritesGrid}>
              {favorites.map((car) => (
                <div key={car.id} className={css.favoriteCard}>
                  {/* Remove button */}
                  <button
                    className={css.removeBtn}
                    onClick={() => handleRemoveFavorite(String(car.id))}
                    aria-label="Remove from favorites"
                  >
                    <Image
                      src="/active-heart.svg"
                      alt="Remove favorite"
                      width={16}
                      height={15}
                    />
                  </button>

                  {/* Car image */}
                  <div className={css.carImageContainer}>
                    {car.img ? (
                      <Image
                        src={car.img}
                        alt={`${car.brand} ${car.model}`}
                        width={200}
                        height={150}
                        className={css.carImage}
                      />
                    ) : (
                      <div className={css.noImage}>No Image Available</div>
                    )}
                  </div>

                  {/* Car details */}
                  <div className={css.carInfo}>
                    <h4 className={css.carTitle}>
                      {car.brand}{" "}
                      <span className={css.carModel}>{car.model}</span>
                    </h4>
                    <p className={css.carYear}>{car.year}</p>
                    <p className={css.carPrice}>${car.rentalPrice}/hour</p>

                    <div className={css.carMeta}>
                      <span className={css.carType}>{car.type}</span>
                      <span className={css.carMileage}>
                        {car.mileage?.toLocaleString("en-US")} km
                      </span>
                    </div>

                    <Link
                      href={`/catalog/${car.id}`}
                      className={css.viewBtn}
                      onClick={onClose}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesModal;
