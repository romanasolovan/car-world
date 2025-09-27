import { Car } from "@/types/cars";
import { CarFilters } from "@/types/filters";
import { create } from "zustand";

interface CarStore {
  // --- STATE ---
  vehicles: Car[];
  filters: CarFilters;
  favorites: Car[];
  loading: boolean;
  error: string | null;

  // --- ACTIONS ---
  setVehicles: (cars: Car[]) => void;
  appendVehicles: (cars: Car[]) => void;
  setFilters: (filters: Partial<CarFilters>) => void;
  resetFilters: () => void;
  addFavorite: (car: Car) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  hydrateFavorites: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // --- SELECTORS ---
  filteredVehicles: () => Car[];
}

const defaultFilters: CarFilters = {
  brand: undefined,
  rentalPrice: undefined,
  minMileage: undefined,
  maxMileage: undefined,
  page: 1,
  limit: "10",
};

const useCarStore = create<CarStore>((set, get) => ({
  vehicles: [],
  filters: defaultFilters,
  favorites: [],
  loading: false,
  error: null,

  setVehicles: (cars) => set({ vehicles: cars }),

  appendVehicles: (cars) =>
    set((state) => {
      const merged = [...state.vehicles, ...cars];
      const unique = merged.filter(
        (car, index, self) => index === self.findIndex((c) => c.id === car.id)
      );
      return { vehicles: unique };
    }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  addFavorite: (car: Car) =>
    set((state) => {
      if (state.favorites.find((c) => c.id === car.id)) return state;
      const updated = [...state.favorites, car];
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  removeFavorite: (id: string) =>
    set((state) => {
      const updated = state.favorites.filter((c) => c.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  clearFavorites: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("favorites");
    }
    set({ favorites: [] });
  },

  hydrateFavorites: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set({ favorites: Array.isArray(parsed) ? parsed : [] });
        } catch (error) {
          console.warn("Failed to parse favorites from localStorage:", error);
          localStorage.removeItem("favorites");
          set({ favorites: [] });
        }
      }
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // FIXED: Proper "Up to" price filtering logic
  filteredVehicles: () => {
    const { vehicles, filters } = get();
    return vehicles.filter((car) => {
      // Brand filter
      if (
        filters.brand &&
        car.brand.toLowerCase() !== filters.brand.toLowerCase()
      ) {
        return false;
      }

      // Price filtering - "Up to" logic (≤ chosen price)
      if (filters.rentalPrice !== undefined) {
        const maxPrice = Number(filters.rentalPrice);
        const carPrice = Number(car.rentalPrice);
        if (carPrice > maxPrice) {
          //  FIXED: Show cars UP TO this price
          return false;
        }
      }

      // Mileage filtering
      if (filters.minMileage !== undefined) {
        const carMileage = Number(car.mileage);
        const minMileage = Number(filters.minMileage);
        if (carMileage < minMileage) {
          return false;
        }
      }

      if (filters.maxMileage !== undefined) {
        const carMileage = Number(car.mileage);
        const maxMileage = Number(filters.maxMileage);
        if (carMileage > maxMileage) {
          return false;
        }
      }

      return true;
    });
  },
}));

export default useCarStore;
