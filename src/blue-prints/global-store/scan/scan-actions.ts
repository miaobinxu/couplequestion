import { FoodData, ProductData, SkinData } from "./scan";

export interface ScanActions {
  updateSkinScan: (scan: Partial<SkinData>) => void;
  updateFoodScan: (scan: Partial<ProductData>) => void;
  updateProductScan: (scan: Partial<FoodData>) => void;
  toggleFavorite: (
    itemId: string,
    category: "food" | "product" | "skin",
    newStatus: boolean
  ) => void;
  resetScanData: () => void;
  setInitialFaceScan: (photos: string[]) => void;
  addFailedScan: (scan: {
    id: string;
    date: string;
    scanType: "food" | "product" | "skin";
    photos: string[];
  }) => void;
}
