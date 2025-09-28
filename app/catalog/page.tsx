"use client";

import { fetchBrands, fetchCars } from "@/lib/api/api";
import { CarsResponse } from "@/types/cars";
import { CarFilters, FiltersState } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar/SearchBar";
import CarList from "@/components/CarList/CarList";
import css from "./Catalog.module.css";
import useCarStore from "@/lib/store/carStore";
import Loader from "@/components/Loader/Loader";
import NoResults from "@/components/NoResults/NoResults";

const PAGE_LIMIT = 12;

function CatalogPage() {
  // SearchBar filters
  const [filters, setFilters] = useState<FiltersState>({
    brand: undefined,
    rentalPrice: undefined,
    minMileage: undefined,
    maxMileage: undefined,
  });

  const fixedPrices = [30, 40, 50, 60, 70, 80];

  // API filters
  const [appliedFilters, setAppliedFilters] = useState<CarFilters>({
    ...filters,
    page: 1,
    limit: String(PAGE_LIMIT),
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const carListRef = useRef<HTMLDivElement>(null);

  // Zustand store
  const vehicles = useCarStore((state) => state.vehicles);
  const setVehicles = useCarStore((state) => state.setVehicles);
  const appendVehicles = useCarStore((state) => state.appendVehicles);
  const setStoreFilters = useCarStore((state) => state.setFilters);
  const resetFilters = useCarStore((state) => state.resetFilters);

  // Convert FiltersState to CarFilters for API
  const convertToApiFilters = (
    filters: FiltersState,
    page: number
  ): CarFilters => ({
    brand: filters.brand,
    rentalPrice: filters.rentalPrice,
    minMileage: filters.minMileage
      ? filters.minMileage.replace(/,/g, "")
      : undefined,
    maxMileage: filters.maxMileage
      ? filters.maxMileage.replace(/,/g, "")
      : undefined,
    page,
    limit: String(PAGE_LIMIT),
  });

  // Fetch cars from API
  const { data, isLoading, isError } = useQuery<CarsResponse, Error>({
    queryKey: ["cars", { page, ...appliedFilters }],
    queryFn: () => fetchCars(appliedFilters),
    placeholderData: (prev) => prev,
  });

  // Fetch brands for select
  const { data: brands = [] } = useQuery<string[], Error>({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  // Update Zustand store when API data changes
  useEffect(() => {
    if (data?.cars) {
      if (page === 1) {
        setVehicles(data.cars);
      } else {
        appendVehicles(data.cars);
      }
      setHasMore(data.cars.length === PAGE_LIMIT);
    } else {
      setHasMore(false);
    }
  }, [data?.cars, page, setVehicles, appendVehicles]);

  // Handle search button click
  const handleSearch = () => {
    const apiFilters = convertToApiFilters(filters, 1);
    setAppliedFilters(apiFilters);
    setStoreFilters(apiFilters); // Keep store in sync
    setPage(1);
    setHasMore(true);
    setHasSearched(true);
  };

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      // Update applied filters with new page
      const apiFilters = convertToApiFilters(filters, nextPage);
      setAppliedFilters(apiFilters);
    }
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({
      brand: undefined,
      rentalPrice: undefined,
      minMileage: undefined,
      maxMileage: undefined,
    });
    setAppliedFilters({
      brand: undefined,
      rentalPrice: undefined,
      minMileage: undefined,
      maxMileage: undefined,
      page: 1,
      limit: String(PAGE_LIMIT),
    });
    resetFilters();
    setPage(1);
    setHasMore(true);
    setHasSearched(false);
  };

  if (isLoading && page === 1) return <Loader />;
  if (isError) {
    return (
      <div className={css.error}>
        <p className={css.errorText}>Something went wrong. Please try again.</p>
      </div>
    );
  }
  // Show no results (only after user has searched)
  const showNoResults = hasSearched && !isLoading && vehicles.length === 0;

  return (
    <div>
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        brands={brands}
        prices={fixedPrices}
      />

      <div ref={carListRef}>
        {showNoResults ? (
          <NoResults
            message="There aren't any cars that match your search criteria. Try adjusting your filters."
            onReset={handleClearFilters}
          />
        ) : (
          <CarList cars={vehicles} />
        )}
      </div>

      {/* Load More Button */}
      {hasMore && vehicles.length > 0 && (
        <div className={css.btnContainer}>
          <button
            onClick={loadMore}
            className={css.loadBtn}
            disabled={isLoading}
          >
            {isLoading && page > 1 ? (
              <span className={css.loadingContainer}>
                <Loader />
                <span className={css.loadingText}>Loading more...</span>
              </span>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
