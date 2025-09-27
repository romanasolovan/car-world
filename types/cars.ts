export interface Car {
  id: string;
  brand: string;
  model?: string;
  year?: number;
  rentalPrice: string;
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
  name: string;
}

export interface CarsResponse {
  cars: Car[];
  totalPages: number;
}
