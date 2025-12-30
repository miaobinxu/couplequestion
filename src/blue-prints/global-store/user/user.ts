export interface UserData {
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "UNKNOWN";
  hasCompletedUserSetup: boolean; // Indicates if the user setup process is complete
  isFreeTrialActive: boolean;
  referralCode?: string;
  refetchSubscriptionStatus: () => void;
  refetchTrialStatus: () => void;
  setIsFreeTrialActive: (val: boolean) => void;
  // Add any other fields you need
}
