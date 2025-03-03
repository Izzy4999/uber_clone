import { DriverStore, LocationStore, MarkerData } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
  userAddress: null,
  userLatitude: null,
  userLongitude: null,
  destinationAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  setDestinationLocation: ({ latitude, longitude, address }) => {
    set({
      destinationAddress: address,
      destinationLatitude: latitude,
      destinationLongitude: longitude,
    });
  },
  setUserLocation: ({ latitude, longitude, address }) => {
    set({
      userAddress: address,
      userLatitude: latitude,
      userLongitude: longitude,
    });
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  status: "notApplied",
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setStatus: (status) => set({ status }),
  setSelectedDriver: (driverId) => set({ selectedDriver: driverId }),
  setDrivers: (drivers) => set({ drivers }),
  clearSelectedDriver: () => set({ selectedDriver: null }),
}));
