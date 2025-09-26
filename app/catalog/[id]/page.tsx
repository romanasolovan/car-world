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

  useEffect(() => {
    if (!id) return;

    async function loadCar() {
      try {
        const data = await fetchCarsById(id);
        setCar(data);
      } catch (error) {
        console.error("Failed to fetch car:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  // if (!error) return <p>Car not found</p>;

  return (
    <section className={css.carCard}>
      <div className={css.cardLeftSide}>
        {/* image and form */}
        <Image
          src={car?.img as string}
          alt={`${car?.brand} ${car?.model}`}
          width={640}
          height={512}
          loading="lazy"
          className={css.carImg}
        />
        <BookingForm />
      </div>

      <div className={css.cardRightSide}>
        {/* car details section */}
        <div className={css.carDetails}>
          {/* line 1 */}
          <h2 className={css.mainDetails}>
            {car?.brand} {car?.model}, {car?.year}
          </h2>
          {/* line 2 */}
          <div className={css.infoRow}>
            <div>
              <svg width={16} height={16}>
                <use href="/location.svg" />
              </svg>
              <span>
                {car?.address
                  .split(",")
                  .slice(1)
                  .map((part) => part.trim())
                  .join(", ")}
              </span>
            </div>
            <div className={css.mileage}>
              <p>Mileage: {car?.mileage} </p>
            </div>
          </div>
          {/* line 3 */}

          <p className={css.rentPrice}>$ {car?.rentalPrice} </p>

          {/* line 4 */}
          <p className={css.descr}>{car?.description}</p>
        </div>

        {/* rental details section */}
        <div className={css.rentalDetails}>
          <div>
            <h3 className={css.subTitle}>Rental Conditions</h3>
            <ul className={css.detailsList}>
              {car?.rentalConditions.map((condition, index) => (
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
                  label: `Year: ${car?.year}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/calendar.svg" />
                    </svg>
                  ),
                },
                {
                  label: `Type: ${car?.type}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/car.svg" />
                    </svg>
                  ),
                },
                {
                  label: `Fuel Consumption: ${car?.fuelConsumption}`,
                  icon: (
                    <svg width={16} height={16}>
                      <use href="/fuel.svg" />
                    </svg>
                  ),
                },
                {
                  label: `Engine Size: ${car?.engineSize}`,
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
              {[
                ...(car?.accessories || []),
                ...(car?.functionalities || []),
              ].map((item, index) => (
                <li key={index} className={css.detailsItem}>
                  <svg width={16} height={16}>
                    <use href="/check.svg" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarDetailsPage;
