import { FiltersState } from "@/types/filters";
import React from "react";
import css from "./SearchBar.module.css";
import CustomSelect from "../CustomSelect/CustomSelect";

// adapt for all devices

interface SearchBarProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onSearch: () => void;
  brands: string[];
  prices: number[];
}

function SearchBar({
  filters,
  setFilters,
  onSearch,
  brands,
  prices,
}: SearchBarProps) {
  // Format number with commas (1000 -> 1,000)
  const formatWithCommas = (value: string): string => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");
    if (numbers === "") return "";

    // Add commas every 3 digits
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle mileage input with auto-formatting
  const handleMileageChange = (
    value: string,
    field: "minMileage" | "maxMileage"
  ) => {
    const formatted = formatWithCommas(value);
    setFilters((prev) => ({
      ...prev,
      [field]: formatted || undefined,
    }));
  };

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };
  return (
    <div className={css.searchBar}>
      {/* Car Brand Select */}
      <CustomSelect
        label="Car Brand"
        value={filters.brand ?? ""}
        onChange={(val) =>
          setFilters((prev) => ({
            ...prev,
            brand: val || undefined,
          }))
        }
        options={[
          { label: "Choose a brand", value: "" },
          ...brands.map((b) => ({ label: b, value: b })),
        ]}
      />

      {/* Rental Price Select */}
      <CustomSelect
        label="Price/ 1 hour"
        value={filters.rentalPrice ?? ""}
        onChange={(val) =>
          setFilters((prev) => ({
            ...prev,
            rentalPrice: val ? String(val) : undefined,
          }))
        }
        options={[
          { label: "Choose a price", value: "" },
          ...prices.map((p) => ({
            label: `Up to $${p}`,
            value: String(p),
          })),
        ]}
      />

      {/* Mileage inputs */}
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
              onChange={(e) =>
                handleMileageChange(e.target.value, "minMileage")
              }
              onKeyDown={handleKeyPress}
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
              onChange={(e) =>
                handleMileageChange(e.target.value, "maxMileage")
              }
              onKeyDown={handleKeyPress}
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
