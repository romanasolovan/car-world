export interface FiltersState {
  brand?: string;
  rentalPrice?: string;
  minMileage?: string;
  maxMileage?: string;
  // page: number;
  // limit: string;
}

export interface CarFilters {
  brand?: string;
  rentalPrice?: string;
  minMileage?: string;
  maxMileage?: string;
  limit?: string;
  page?: string | number;
}
