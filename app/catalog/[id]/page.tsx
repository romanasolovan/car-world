"use client";

import { fetchCarsById } from "@/lib/api/api";
import { Car } from "@/types/cars";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import css from "./CarCardDetails.module.css";
import BookingForm from "@/components/CarRentalForm/CarRentalForm";

function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadCar() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCarsById(id);
        setCar(data);

        // Check if this car is in favorites
        if (typeof window !== "undefined") {
          const favoriteIds = JSON.parse(
            localStorage.getItem("favoriteIds") || "[]"
          );
          setIsFavorite(favoriteIds.includes(String(data.id)));
        }
      } catch (error) {
        console.error("Failed to fetch car:", error);
        setError("Car not found");
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  const toggleFavorite = () => {
    if (!car) return;

    const carId = String(car.id);

    setIsFavorite((prev) => {
      const newIsFavorite = !prev;

      // Update favoriteIds
      setTimeout(() => {
        const favoriteIds = JSON.parse(
          localStorage.getItem("favoriteIds") || "[]"
        );
        let updatedIds: string[];

        if (newIsFavorite) {
          updatedIds = [...favoriteIds, carId];
        } else {
          updatedIds = favoriteIds.filter((id: string) => id !== carId);
        }

        localStorage.setItem("favoriteIds", JSON.stringify(updatedIds));

        // Update full car objects
        const existingFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        let updatedFavorites: Car[];

        if (newIsFavorite) {
          const carExists = existingFavorites.some(
            (favCar: Car) => String(favCar.id) === carId
          );
          if (!carExists) {
            updatedFavorites = [...existingFavorites, car];
          } else {
            updatedFavorites = existingFavorites;
          }
        } else {
          updatedFavorites = existingFavorites.filter(
            (favCar: Car) => String(favCar.id) !== carId
          );
        }

        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        window.dispatchEvent(new Event("favoritesChanged"));
      }, 0);

      return newIsFavorite;
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error || !car) return <p>{error || "Car not found"}</p>;

  return (
    <section className={css.carCard}>
      <div className={css.cardLeftSide}>
        {/* Image with Heart Button */}
        <div className={css.imageContainer}>
          {car.img ? (
            <Image
              src={car.img}
              alt={`${car.brand} ${car.model}`}
              width={640}
              height={512}
              loading="lazy"
              className={css.carImg}
            />
          ) : (
            <div
              className={css.carImg}
              style={{
                width: 640,
                height: 512,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
              }}
            >
              No Image Available
            </div>
          )}

          {/* Heart Button - Bigger for car details */}
          <button
            className={`${css.heartBtn} ${isFavorite ? css.active : ""}`}
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Image
              src={isFavorite ? "/active-heart.svg" : "/favorites-heart.svg"}
              alt="favorite"
              width={24}
              height={22}
            />
          </button>
        </div>

        <BookingForm />
      </div>

      <div className={css.cardRightSide}>
        {/* car details section */}
        <div className={css.carDetails}>
          {/* line 1 */}
          <h2 className={css.mainDetails}>
            {car.brand} {car.model}, {car.year}
          </h2>
          <span className={css.id}>{`Id:${car.id.slice(0, 4)} `}</span>
          {/* line 2 */}
          <div className={css.infoRow}>
            <div>
              <svg width={16} height={16}>
                <use href="/location.svg" />
              </svg>
              <span>
                {car.address
                  .split(",")
                  .slice(1)
                  .map((part) => part.trim())
                  .join(", ")}
              </span>
            </div>
            <div className={css.mileage}>
              <p>Mileage: {car.mileage?.toLocaleString()} km</p>
            </div>
          </div>
          {/* line 3 */}
          <p className={css.rentPrice}>$ {car.rentalPrice} </p>

          {/* line 4 */}
          <p className={css.descr}>{car.description}</p>
        </div>

        {/* rental details section */}
        <div className={css.rentalDetails}>
          <div>
            <h3 className={css.subTitle}>Rental Conditions</h3>
            <ul className={css.detailsList}>
              {car.rentalConditions?.map((condition, index) => (
                <li key={index} className={css.detailsItem}>
                  <svg width={16} height={16}>
                    <use href="/check.svg" />
                  </svg>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
          {/* car specifics section */}
          <div className={css.carSpecification}>
            <h3 className={css.subTitle}>Car Specifications</h3>
            <ul className={css.detailsList}>
              {[
                {
                  label: `Year: ${car.year}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/calendar.svg" />
                    </svg>
                  ),
                },
                {
                  label: `Type: ${car.type}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/car.svg" />
                    </svg>
                  ),
                },
                {
                  label: `Fuel Consumption: ${car.fuelConsumption}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/fuel.svg" />
                    </svg>
                  ),
                },
                {
                  label: `Engine Size: ${car.engineSize}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/settings.svg" />
                    </svg>
                  ),
                },
              ].map((spec, index) => (
                <li key={index} className={css.detailsItem}>
                  {spec.icon}
                  <span>{spec.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* accessories and functions section */}
          <div>
            <h3 className={css.subTitle}>Accessories and Functionalities</h3>
            <ul className={css.detailsList}>
              {[...(car.accessories || []), ...(car.functionalities || [])].map(
                (item, index) => (
                  <li key={index} className={css.detailsItem}>
                    <svg width={16} height={16}>
                      <use href="/check.svg" />
                    </svg>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarDetailsPage;
