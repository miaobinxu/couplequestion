import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Onboarding } from "@blue-prints/global-store/onboarding/onboarding";
import { OnboardingActions } from "@blue-prints/global-store/onboarding/onboarding-actions";
import { zustandMMKVStorage } from "../blue-prints/local-store/mmkvStorageAdapter";

const initialState: Onboarding = {
  gender: "",
  ageGroup: "",
  referralSource: "",
  skinType: "",
  skinConcern: [],
  skinGoal: [],
  referralCode: "",
  name: "",
  birthDate: undefined,
  birthLocation: "",
  birthTime: undefined,
};

export const useOnboardingStore = create<Onboarding & OnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,
      updateOnboarding: (onboarding: Partial<Onboarding>) =>
        set((state) => ({ ...state, ...onboarding })),
      resetOnboarding: () => set(() => ({ ...initialState })),
    }),
    {
      name: "onboarding-data", // Storage key
      storage: zustandMMKVStorage,
    }
  )
);
