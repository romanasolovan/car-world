export interface Car {
  id: number | string;
  brand: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  img?: string;
  description?: string;
  rentalPrice?: number;
  address: string;
  rentalCompany: string;
  type: string;
}

export interface CarFilters {
  brand?: string;
  price?: string | number;
  minMileage?: string | number;
  maxMileage?: string | number;
  limit?: string | number;
  page?: string | number;
}

export interface CarsResponse {
  cars: Car[];
  totalPages: number;
}
