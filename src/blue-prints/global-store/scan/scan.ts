export interface ScanBase {
  photos: String[];
  scanType: "skin" | "food" | "product";
  name: string;
  isFavourite: boolean;
  id: string;
}

export interface Risk {
  name: string;
  value: number;
}

export interface Ingredient {
  name: string;
  riskLevel: "Low Risk" | "No Risk" | "High Risk";
}

export interface Score {
  name: string;
  value: number;
  description: string;
}

export interface SkinData extends ScanBase {
  date: string;
  overallScore: Score;
  skinType: string;
  isFavourite: boolean;
  information: Risk[];
  keyTakeaway: String[];
}

export interface FoodData extends ScanBase {
  date: string;
  overallScore: Score;
  fitScore: Score;
  containsDairy: boolean;
  information: Risk[];
  keyTakeaway: String[];
}

export interface ProductData extends ScanBase {
  date: string;
  overallScore: Score;
  fitScore: Score;
  penaltyIngredients: Ingredient[];
  starIngredients: Ingredient[];
  keyTakeaway: String[];
}

export interface ScanData {
  skin: SkinData[];
  product: ProductData[];
  food: FoodData[];
  initialFaceScan: string[];
  failedScans: {
    id: string;
    date: string;
    scanType: "food" | "product" | "skin";
    photos: string[];
  }[];
}

export const sampleScanData = {
  skin: [
    {
      photos: [],
      scanType: "skin",
      name: "Morning Skin Check",
      isFavourite: false,
      id: "skin-001",
      date: "2025-08-27T15:00:00Z",
      overallScore: {
        name: "Overall score",
        value: 94,
        description: "Excellent",
      },
      skinType: "Oily",
      information: [
        { name: "Acne", value: 54 },
        { name: "Pores", value: 32 },
        { name: "Hydration", value: 12 },
        { name: "Redness", value: 55 },
        { name: "Wrinkles", value: 23 },
        { name: "Eye Bag", value: 25 },
      ],
      keyTakeaway: ["Maintain hydration and use non-comedogenic products."],
    },
  ],
  food: [
    {
      photos: [],
      scanType: "food",
      name: "Lunch Nutrition Check",
      isFavourite: false,
      id: "food-002",
      date: "2025-08-27T15:00:00Z",
      overallScore: {
        name: "Overall score",
        value: 94,
        description: "Excellent",
      },
      fitScore: { name: "Compatibility", value: 94, description: "Excellent" },
      containsDairy: true,
      information: [
        { name: "Bloat Risk", value: 42 },
        { name: "Puffiness Risk", value: 42 },
        { name: "Sensitivity Risk", value: 42 },
        { name: "Acne Risk", value: 25 },
        { name: "Dryness Risk", value: 66 },
        { name: "Oiliness Impact", value: 66 },
      ],
      keyTakeaway: [
        "Coconut water provides hydration and antioxidants to improve skin texture and even out pigmentation.",
      ],
    },
  ],
  product: [
    {
      photos: [],
      scanType: "product",
      name: "Night Cream Check",
      isFavourite: false,
      id: "product-003",
      date: "2025-08-27T15:00:00Z",
      overallScore: {
        name: "Overall score",
        value: 94,
        description: "Excellent",
      },
      fitScore: { name: "Compatibility", value: 94, description: "Excellent" },
      penaltyIngredients: [
        { name: "Parabens", riskLevel: "Low Risk" },
        { name: "Fragrance", riskLevel: "No Risk" },
      ],
      starIngredients: [
        { name: "Hyaluronic Acid", riskLevel: "Low Risk" },
        { name: "Niacinamide", riskLevel: "No Risk" },
      ],
      keyTakeaway: [
        "Effective for hydration and brightening without significant risks.",
      ],
    },
  ],
};
