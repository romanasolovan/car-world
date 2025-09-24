import { CarFilters } from "@/types/filters";
import { FiltersState } from "@/types/filters";
import React from "react";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  filters: FiltersState;
  //   filters: CarFilters;
  setFilters: React.Dispatch<React.SetStateAction<CarFilters>>;
  onSearch: () => void;
  brands: string[];
  prices: number[];
}

// finish setting up the search bar (styling, scroll, svg)

function SearchBar({
  filters,
  setFilters,
  onSearch,
  brands,
  prices,
}: SearchBarProps) {
  return (
    <div className={css.searchBar}>
      {/* Car Brand */}
      <div className={css.group}>
        <label htmlFor="title" className={css.groupName}>
          Car Brand
        </label>
        <select
          className={css.filter}
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
      </div>

      {/* Price Filter */}
      <div className={css.group}>
        <label htmlFor="price" className={css.groupName}>
          Price/ 1 hour
        </label>
        <div className={css.selectWrapper}>
          <select
            className={css.filter}
            value={filters.rentalPrices || ""}
            onChange={(e) =>
              setFilters({ ...filters, rentalPrices: Number(e.target.value) })
            }
          >
            <option value="">Choose a price</option>
            {prices.map((p) => (
              <option key={p} value={p}>
                {p} USD/hour
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* mileage input */}

      <div className={css.inputs}>
        <label htmlFor="mileage" className={css.groupName}>
          Сar mileage / km
        </label>
        <input
          className={css.mininput}
          type="number"
          placeholder="Mileage from"
          value={filters.minMileage || ""}
          onChange={(e) =>
            setFilters({ ...filters, minMileage: e.target.value || undefined })
          }
        />

        <input
          className={css.maxinput}
          type="number"
          placeholder="Mileage to"
          value={filters.maxMileage || ""}
          onChange={(e) =>
            setFilters({ ...filters, maxMileage: e.target.value || undefined })
          }
        />
      </div>

      <button className={css.searchBtn} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
