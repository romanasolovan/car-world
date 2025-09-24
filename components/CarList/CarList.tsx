import React from "react";
import { Car } from "@/types/cars";
import css from "./CarList.module.css";
import Image from "next/image";

interface CarListProps {
  cars: Car[];
}

function CarList({ cars }: CarListProps) {
  return (
    <div className={css.card}>
      {cars.map((car) => (
        <div key={car.id} className={css.carid}>
          {car.img && (
            <Image
              src={car.img}
              className={css.img}
              alt={`car`}
              width={300}
              height={268}
            />
            // <img
            //   src={car.img}
            //   className={css.img}
            //   alt={`${car.brand} ${car.model} `}
            //   width={300}
            // />
          )}
          <h3>
            {car.brand} {car.model}, {car.year} ${car.rentalPrice}
          </h3>
          <p>
            {car.address
              .split(",")
              .slice(-2)
              .map((part) => part.trim())
              .join(", ")}{" "}
            {car.rentalCompany}
          </p>
          <p>
            {" "}
            {car.type} {car.mileage?.toLocaleString("en-US")} km
          </p>
          <button>Read More</button>
        </div>
      ))}
    </div>
  );
}

export default CarList;
