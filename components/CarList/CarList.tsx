"use client";

import React, { useEffect, useState } from "react";
import { Car } from "@/types/cars";
import css from "./CarList.module.css";
import Image from "next/image";
import Link from "next/link";

interface CarListProps {
  cars: Car[];
}

function CarList({ cars }: CarListProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorite IDs on mount and when favorites change
  useEffect(() => {
    const loadFavoriteIds = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("favoriteIds");
        if (saved) {
          try {
            setFavoriteIds(JSON.parse(saved));
          } catch {
            setFavoriteIds([]);
          }
        } else {
          setFavoriteIds([]);
        }
      }
    };

    // Load initially
    loadFavoriteIds();

    // Listen for favorites changes from other components
    const handleFavoritesChange = () => {
      loadFavoriteIds();
    };

    window.addEventListener("favoritesChanged", handleFavoritesChange);

    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
    };
  }, []);

  const toggleFavorite = (car: Car) => {
    const carId = String(car.id);

    // Use callback to avoid state updates during render
    setFavoriteIds((prevIds) => {
      const isCurrentlyFavorite = prevIds.includes(carId);
      let updatedIds: string[];

      if (isCurrentlyFavorite) {
        updatedIds = prevIds.filter((id) => id !== carId);
      } else {
        updatedIds = [...prevIds, carId];
      }

      // Perform localStorage updates in a timeout to avoid setState during render
      setTimeout(() => {
        // Save IDs to localStorage
        localStorage.setItem("favoriteIds", JSON.stringify(updatedIds));

        // Get existing favorite car objects
        const existingFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        let updatedFavorites: Car[];

        if (isCurrentlyFavorite) {
          // Remove car object from favorites
          updatedFavorites = existingFavorites.filter(
            (favCar: Car) => String(favCar.id) !== carId
          );
        } else {
          // Add car object to favorites (avoid duplicates)
          const carExists = existingFavorites.some(
            (favCar: Car) => String(favCar.id) === carId
          );
          if (!carExists) {
            updatedFavorites = [...existingFavorites, car];
          } else {
            updatedFavorites = existingFavorites;
          }
        }

        // Save full car objects to localStorage
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

        // Dispatch event to update header counter
        window.dispatchEvent(new Event("favoritesChanged"));
      }, 0);

      return updatedIds;
    });
  };

  return (
    <div className={css.carContainer}>
      <ul className={css.carCard}>
        {cars.map((car) => (
          <li key={car.id} className={css.carId}>
            {/* Heart button */}
            <button
              className={`${css.heartBtn} ${
                favoriteIds.includes(String(car.id)) ? css.active : ""
              }`}
              onClick={() => toggleFavorite(car)}
              aria-label={
                favoriteIds.includes(String(car.id))
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <Image
                src={
                  favoriteIds.includes(String(car.id))
                    ? "/active-heart.svg"
                    : "/default-heart.svg"
                }
                alt="favorite"
                width={16}
                height={15}
              />
            </button>

            {/* Car Image */}
            <div className={css.carImg}>
              {car.img ? (
                <Image
                  src={car.img}
                  className={css.img}
                  alt={`${car.brand} ${car.model}`}
                  width={300}
                  height={268}
                />
              ) : (
                <div
                  className={css.img}
                  style={{
                    width: 300,
                    height: 268,
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className={css.carDetails}>
              {/* Top group: brand, year, price */}
              <div className={css.mainInfo}>
                <h3 className={css.carTitle}>
                  {`${car.brand} ${car.model}`.length > 20 ? (
                    <>
                      {`${car.brand} ${car.model}`.slice(0, 20)}... , {car.year}
                    </>
                  ) : (
                    <>
                      {car.brand}{" "}
                      <span className={css.accent}>{car.model}</span>,{" "}
                      {car.year}
                    </>
                  )}
                </h3>
                <span className={css.price}>${car.rentalPrice}</span>
              </div>

              {/* Bottom group: address, rental company, type, mileage */}
              <div className={css.extraInfo}>
                <div className={css.block}>
                  <p>
                    {car.address
                      .split(",")
                      .slice(1, 2)
                      .map((part) => part.trim())
                      .join(" ")}
                  </p>
                  <p>
                    {car.address
                      .split(",")
                      .slice(2, 3)
                      .map((part) => part.trim())
                      .join(" ")}
                  </p>
                  <p>{car.rentalCompany}</p>
                </div>

                <div className={css.block}>
                  <p>{car.type}</p>
                  <p>{car.mileage?.toLocaleString("en-US")} km</p>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className={css.moreBtn}>
              <Link href={`/catalog/${car.id}`} className={css.readMoreBtn}>
                Read More
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarList;
