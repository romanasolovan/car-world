import { CarFilters } from "@/types/cars";
import { FiltersState } from "@/types/filters";
import React from "react";

interface SearchBarProps {
  filters: FiltersState;
  //   filters: CarFilters;
  setFilters: React.Dispatch<React.SetStateAction<CarFilters>>;
  onSearch: () => void;
  brands: string[];
}

function SearchBar({ filters, setFilters, onSearch, brands }: SearchBarProps) {
  return (
    <div>
      {/* filtering brands */}
      <select
        value={filters.brand ?? ""}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
      >
        <option value="">Choose a brand</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      {/* filtering prices */}

      <select
        value={filters.price || ""}
        onChange={(e) =>
          setFilters({ ...filters, price: e.target.value || undefined })
        }
      >
        <option value="">Choose a price</option>
        <option value="30">30 USD/day</option>
        <option value="50">50 USD/day</option>
        <option value="100">100 USD/day</option>
      </select>

      {/* mileage input */}
      <input
        type="number"
        placeholder="Mileage from"
        value={filters.minMileage || ""}
        onChange={(e) =>
          setFilters({ ...filters, minMileage: e.target.value || undefined })
        }
      />

      <input
        type="number"
        placeholder="Mileage to"
        value={filters.maxMileage || ""}
        onChange={(e) =>
          setFilters({ ...filters, maxMileage: e.target.value || undefined })
        }
      />

      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
