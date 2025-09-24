import { CarFilters, CarsResponse } from "@/types/cars";
import axios from "axios";

axios.defaults.baseURL = "https://car-rental-api.goit.global";

export async function fetchCars(filters: CarFilters = {}) {
  const params: CarFilters = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
    brand: filters.brand,
    price: filters.price,
    minMileage: filters.minMileage,
    maxMileage: filters.maxMileage,
  };

  if (filters.brand) params.brand = filters.brand;
  if (filters.price) params.price = Number(filters.price);
  if (filters.minMileage) params.minMileage = Number(filters.minMileage);
  if (filters.maxMileage) params.maxMileage = Number(filters.maxMileage);

  const response = await axios.get<CarsResponse>(`/cars`, { params });
  return response.data;
}

export async function fetchBrands() {
  const response = await axios.get("/brands");
  return response.data as string[];
}
