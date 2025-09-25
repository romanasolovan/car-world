"use client";

import { fetchBrands, fetchCars, fetchRentalPrices } from "@/lib/api/api";
import { Car, CarsResponse } from "@/types/cars";
import { CarFilters, FiltersState } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar/SearchBar";
import CarList from "@/components/CarList/CarList";
import css from "./Catalog.module.css";

const PAGE_LIMIT = 12;

// fix pagination and smooth scrolling

function CatalogPage() {
  const [filters, setFilters] = useState<FiltersState>({
    brand: undefined,
    rentalPrices: undefined,
    minMileage: undefined,
    maxMileage: undefined,
  });

  const [appliedFilters, setAppliedFilters] = useState<CarFilters>(filters);
  const [page, setPage] = useState(1);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const carListRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery<CarsResponse, Error>({
    queryKey: ["cars", { page, ...appliedFilters }],
    queryFn: () =>
      fetchCars({ page, limit: String(PAGE_LIMIT), ...appliedFilters }),

    placeholderData: (prev) => prev,
  });

  const { data: brands = [] } = useQuery<string[], Error>({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const { data: prices = [] } = useQuery<(number | undefined)[], Error>({
    queryKey: ["rentalPrices"],
    queryFn: fetchRentalPrices,
  });

  useEffect(() => {
    if (data?.cars) {
      if (page === 1) {
        setAllCars(data.cars);
      } else {
        setAllCars((prev) => [...prev, ...data.cars]);
      }

      setHasMore(data.cars.length === PAGE_LIMIT);
    } else {
      setHasMore(false);
    }
  }, [data?.cars, page]);

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(1);
    setAllCars([]);
    setHasMore(true);
  };

  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  if (isLoading && page === 1) return <p>Loading wait...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <div>
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        brands={brands}
        prices={prices.filter((p): p is number => p !== undefined)}
      />

      <div ref={carListRef}>
        <CarList cars={allCars} />
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button onClick={loadMore} className={css.loadBtn}>
            {isLoading && page > 1 ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
