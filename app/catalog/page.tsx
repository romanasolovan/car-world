"use client";

import { fetchBrands, fetchCars, fetchRentalPrices } from "@/lib/api/api";
import { Car } from "@/types/cars";
import { CarFilters } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar/SearchBar";
import CarList from "@/components/CarList/CarList";
import { FiltersState } from "@/types/filters";

// review code and clean it up a bit

function CatalogPage() {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FiltersState>({
    brand: undefined,
    rentalPrices: undefined,
    minMileage: undefined,
    maxMileage: undefined,
  });
  const [appliedFilters, setAppliedFilters] = useState<CarFilters>(filters);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cars", { page, ...appliedFilters }],
    queryFn: () => fetchCars({ page, limit: 12, ...appliedFilters }),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const { data: prices = [] } = useQuery({
    queryKey: ["rentalPrices"],
    queryFn: fetchRentalPrices,
  });

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(1); // reset page on new search
  };

  if (isLoading) return <p>Loading wait</p>;
  if (isError) return <p>Something went wrong</p>;

  const cars: Car[] = data?.cars || [];

  return (
    <div>
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        brands={brands}
        prices={
          prices?.filter((price): price is number => price !== undefined) || []
        }
      />

      <CarList cars={cars} />

      <button onClick={() => setPage((p) => p + 1)}>Load more</button>
    </div>
  );
}

export default CatalogPage;
