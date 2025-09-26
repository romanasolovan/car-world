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

//  filtering, fixing (,) issues!!!!

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

      {/* Car Brand Select*/}

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
          <div className={css.inputWrapper}>
            <span className={css.inputPrefix}>From</span>
            <input
              id="minMileage"
              className={css.minInput}
              type="text"
              placeholder=""
              value={filters.minMileage || ""}
              onChange={(e) => {
                const rawValue = e.target.value;
                const cleaned = rawValue.replace(/[^0-9,.\s]/g, "");
                setFilters({
                  ...filters,
                  minMileage: cleaned || undefined,
                });
              }}
              aria-label="Minimum mileage"
            />
          </div>

          <div className={css.inputWrapper}>
            <span className={css.inputPrefix}>To</span>
            <input
              id="maxMileage"
              className={css.maxInput}
              type="text"
              placeholder=""
              value={filters.maxMileage || ""}
              onChange={(e) => {
                const rawValue = e.target.value;
                const cleaned = rawValue.replace(/[^0-9,.\s]/g, "");
                setFilters({
                  ...filters,
                  maxMileage: cleaned || undefined,
                });
              }}
              aria-label="Maximum mileage"
            />
          </div>
        </div>
      </div>

      <button className={css.searchBtn} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
