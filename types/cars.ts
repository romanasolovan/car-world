export interface Car {
  id: number | string;
  brand: string;
  model?: string;
  year?: number;
  rentalPrice?: number;
  mileage?: number;
  img?: string;
  description?: string;
  address: string;
  rentalCompany: string;
  type: string;
  fuelConsumption: string;
  engineSize: string;
  accessories: string[];
  functionalities: string[];
  rentalConditions: string[];
}

export interface CarsResponse {
  cars: Car[];
  totalPages: number;
}
