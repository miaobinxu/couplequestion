import { Onboarding } from "@blue-prints/global-store/onboarding/onboarding";

export interface OnboardingActions {
    updateOnboarding: (onboarding: Partial<Onboarding>) => void;
    resetOnboarding: () => void;
}
