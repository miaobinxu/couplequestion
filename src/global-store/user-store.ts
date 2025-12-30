import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserActions } from "@blue-prints/global-store/user/user-actions";
import { zustandMMKVStorage } from "../blue-prints/local-store/mmkvStorageAdapter";
import { UserData } from "../blue-prints/global-store/user/user";
import { checkSubscriptionActive } from "../services/native/billing";
import { supabase } from "../utilities/supabase";
import { Platform } from "react-native";
import { SUBSCRIPTION_CONFIG } from "../config/subscription";

// Define the initial user state
const initialUserState: UserData = {
  subscriptionStatus: "UNKNOWN",
  hasCompletedUserSetup: false,
  isFreeTrialActive: false,
  setIsFreeTrialActive: () => {
    // Placeholder function, will be replaced by the actual implementation in the store
  },
  refetchSubscriptionStatus: async () => {
    // Placeholder function, will be replaced by the actual implementation in the store
    return;
  },
};

export const useUserStore = create<UserData & UserActions>()(
  persist(
    (set, get) => {
      // Function to refetch and update the subscription status
      const refetchSubscriptionStatus = async () => {
        try {
          let isActive = false;

          if (Platform.OS === "ios") {
            const monthlyActive = await checkSubscriptionActive(
              SUBSCRIPTION_CONFIG.ios.monthlyId
            );
            const yearlyActive = await checkSubscriptionActive(
              SUBSCRIPTION_CONFIG.ios.yearlyId
            );
            isActive = monthlyActive || yearlyActive;
          } else {
            isActive = await checkSubscriptionActive(
              SUBSCRIPTION_CONFIG.android.parentId
            );
          }

          set({ subscriptionStatus: isActive ? "ACTIVE" : "INACTIVE" });
        } catch (error) {
          console.error("Error checking subscription status:", error);
          set({ subscriptionStatus: "UNKNOWN" });
        }
      };

      // Initialize subscription status when the store is created
      refetchSubscriptionStatus();

      const setIsFreeTrialActive = (val: boolean) => {
        set((state: UserData) => ({
          ...state,
          isFreeTrialActive: val,
        }));
      };

      return {
        ...initialUserState,
        updateUser: (user: Partial<UserData>) =>
          set((state: UserData) => ({ ...state, ...user })),
        resetUser: () => set(() => ({ ...initialUserState })),
        refetchSubscriptionStatus, // Expose the refetch function
        setIsFreeTrialActive,
      };
    },
    {
      name: "user-data", // Storage key
      storage: zustandMMKVStorage,
    }
  )
);
