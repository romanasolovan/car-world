import { CarFilters, FiltersState } from "@/types/filters";
import React from "react";
import css from "./SearchBar.module.css";
import CustomSelect from "../CustomSelect/CustomSelect";

interface SearchBarProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<CarFilters>>;
  onSearch: () => void;
  brands: string[];
  prices: number[];
}

// fixing those inputs, so they match aaaaa

function SearchBar({
  filters,
  setFilters,
  onSearch,
  brands,
  prices,
}: SearchBarProps) {
  return (
    <div className={css.searchBar}>
      {/* Car Brand Select*/}

      <CustomSelect
        label="Car Brand"
        value={filters.brand ?? ""}
        onChange={(val) => setFilters({ ...filters, brand: val })}
        options={[
          { label: "Choose a brand", value: "" },
          ...brands.map((b) => ({ label: b, value: b })),
        ]}
      />

      <CustomSelect
        label="Price/ 1 hour"
        value={filters.rentalPrices ?? ""}
        onChange={(val) => setFilters({ ...filters, rentalPrices: val })}
        options={[
          { label: "Choose a price", value: "" },
          ...prices.map((p) => ({ label: `${p} USD/hour`, value: String(p) })),
        ]}
      />

      {/* mileage input */}

      <div className={css.inputs}>
        <label className={css.groupName}>Сar mileage / km</label>

        <div className={css.inputGroup}>
          <input
            className={css.minInput}
            type="number"
            placeholder="From"
            value={filters.minMileage || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                minMileage: e.target.value || undefined,
              })
            }
          />

          <input
            className={css.maxInput}
            type="number"
            placeholder="To"
            value={filters.maxMileage || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxMileage: e.target.value || undefined,
              })
            }
          />
        </div>
      </div>

      <button className={css.searchBtn} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
