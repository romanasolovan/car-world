import { Car, CarFilters } from "@/types/cars";
import { create } from "zustand";

// Define the shape of the store
interface CarStore {
  // --- STATE ---
  vehicles: Car[]; // list of cars currently fetched
  filters: CarFilters; // active filters for API calls
  favorites: Car[]; // saved favorite cars
  loading: boolean; // whether data is loading
  error: string | null; // error messages

  // --- ACTIONS (functions that change state) ---
  setVehicles: (cars: Car[]) => void; // replace vehicle list
  appendVehicles: (cars: Car[]) => void; // add more vehicles (pagination)???
  setFilters: (filters: CarFilters) => void; // update filters
  resetFilters: () => void; // clear filters
  addFavorite: (car: Car) => void; // save favorite car
  removeFavorite: (id: number) => void; // remove favorite by id
  clearFavorites: () => void; // wipe favorites
  setLoading: (loading: boolean) => void; // toggle loading state
  setError: (error: string | null) => void; // set error message
}

// Create Zustand store
const useCarStore = create<CarStore>((set) => ({
  // --- Initial state values ---
  vehicles: [], // start with empty car list
  filters: { brand: "", limit: "10", page: "1" }, // sensible defaults
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"), // load from localStorage
  loading: false, // nothing loading at start
  error: null, // no error at start

  // --- Actions ---
  setVehicles: (cars) => set({ vehicles: cars }),

  appendVehicles: (cars) =>
    set((state) => ({ vehicles: [...state.vehicles, ...cars] })),

  setFilters: (filters) => set({ filters }),

  resetFilters: () => set({ filters: { brand: "", limit: "10", page: "1" } }),

  addFavorite: (car) =>
    set((state) => {
      const updated = [...state.favorites, car];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return { favorites: updated };
    }),

  removeFavorite: (id) =>
    set((state) => {
      const updated = state.favorites.filter((c) => c.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return { favorites: updated };
    }),

  clearFavorites: () => {
    localStorage.removeItem("favorites");
    set({ favorites: [] });
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));

export default useCarStore;
