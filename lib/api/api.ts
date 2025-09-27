import { Car, CarsResponse } from "@/types/cars";
import { CarFilters } from "@/types/filters";
import axios from "axios";

axios.defaults.baseURL = "https://car-rental-api.goit.global";

export async function fetchCars(filters: CarFilters = {}) {
  const params: CarFilters = {
    page: filters.page ?? 1,
    limit: filters.limit ?? "12",
    brand: filters.brand,
    rentalPrice: filters.rentalPrice,
    minMileage: filters.minMileage,
    maxMileage: filters.maxMileage,
  };

  if (filters.brand) params.brand = filters.brand;
  if (filters.rentalPrice) params.rentalPrice = String(filters.rentalPrice);
  if (filters.minMileage) params.minMileage = String(filters.minMileage);
  if (filters.maxMileage) params.maxMileage = String(filters.maxMileage);

  const response = await axios.get<CarsResponse>(`/cars`, { params });
  return response.data;
}

export async function fetchBrands() {
  const response = await axios.get("/brands");
  return response.data as string[];
}

export async function fetchRentalPrices() {
  const response = await axios.get("/cars");
  const cars: Car[] = response.data.cars;

  const prices = [...new Set(cars.map((car) => car.rentalPrice))];
  return prices.sort((a, b) => Number(a) - Number(b));
}

export async function fetchCarsById(id: string) {
  const response = await axios.get(`/cars/${id}`);
  return response.data as Car;
}
