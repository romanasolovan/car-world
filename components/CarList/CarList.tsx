"use client";

import React, { useEffect, useState } from "react";
import { Car } from "@/types/cars";
import css from "./CarList.module.css";
import Image from "next/image";
import Link from "next/link";

// function to add favorites to a separete components + styling in my manner

interface CarListProps {
  cars: Car[];
}

function CarList({ cars }: CarListProps) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated)); // save immediately
      return updated;
    });
  };

  return (
    <div className={css.carContainer}>
      <ul className={css.carCard}>
        {cars.map((car) => (
          <li key={car.id} className={css.carId}>
            {/* heart svg */}
            <button
              className={`${css.heartBtn} ${
                favorites.includes(String(car.id)) ? css.active : ""
              }`}
              onClick={() => toggleFavorite(String(car.id))}
              aria-label={
                favorites.includes(String(car.id))
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <Image
                src={
                  favorites.includes(String(car.id))
                    ? "/active-heart.svg" // filled heart
                    : "/default-heart.svg" // outline heart (always visible)
                }
                alt="favorite"
                width={16}
                height={15}
              />
            </button>

            {/* Car Image */}
            <div className={css.carImg}>
              {car.img && (
                <Image
                  src={car.img}
                  className={css.img}
                  alt={`${car.brand} ${car.model}`}
                  width={300}
                  height={268}
                />
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
                  <p>{car.mileage?.toLocaleString("fr-FR")} km</p>
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
