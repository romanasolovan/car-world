export interface FiltersState {
  brand?: string;
  rentalPrices?: string | number;
  minMileage?: string | number;
  maxMileage?: string | number;
}

export interface CarFilters {
  brand?: string;
  rentalPrices?: string | number;
  minMileage?: string | number;
  maxMileage?: string | number;
  limit?: string | number;
  page?: string | number;
}
