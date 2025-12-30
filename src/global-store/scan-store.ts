// @blue-prints/global-store/user/user-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScanActions } from "@blue-prints/global-store/scan/scan-actions";
import { zustandMMKVStorage } from "../blue-prints/local-store/mmkvStorageAdapter";
import {
  ScanData,
  SkinData,
  ProductData,
  FoodData,
} from "../blue-prints/global-store/scan/scan";

// Define the initial scan state
const initialScanState: ScanData = {
  skin: [],
  product: [],
  food: [],
  initialFaceScan: [],
  failedScans: [], // <-- new
};

export const useScanStore = create<ScanData & ScanActions>()(
  persist(
    (set) => ({
      ...initialScanState,
      updateSkinScan: (skin: Partial<SkinData>) =>
        set((state) => ({
          ...state,
          skin: [...state.skin, skin as SkinData], // Ensure skin matches SkinData type
        })),
      updateFoodScan: (food: Partial<FoodData>) =>
        set((state) => ({
          ...state,
          food: [...state.food, food as FoodData],
        })),
      updateProductScan: (product: Partial<ProductData>) =>
        set((state) => ({
          ...state,
          product: [...state.product, product as ProductData],
        })),
      toggleFavorite: (
        itemId: string,
        category: "food" | "product" | "skin",
        newStatus: boolean
      ) =>
        set((state) => {
          const updatedCategory = state[category].map((item) =>
            item.id === itemId ? { ...item, isFavourite: newStatus } : item
          );
          return { ...state, [category]: updatedCategory };
        }),
      resetScanData: () => set(() => ({ ...initialScanState })),
      setInitialFaceScan: (photos: string[]) =>
        set((state) => ({
          ...state,
          initialFaceScan: [...photos],
        })),
      addFailedScan: (scan) =>
        set((state) => ({
          ...state,
          failedScans: [...state.failedScans, scan],
        })),
    }),
    {
      name: "scan-data", // Storage key
      storage: zustandMMKVStorage,
    }
  )
);
