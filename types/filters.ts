export interface FiltersState {
  brand?: string;
  rentalPrices?: string;
  minMileage?: string;
  maxMileage?: string;
}

export interface CarFilters {
  brand?: string;
  rentalPrices?: string;
  minMileage?: string;
  maxMileage?: string;
  limit?: string;
  page?: string | number;
}
