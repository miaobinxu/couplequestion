export const SUBSCRIPTION_CONFIG = {
  ios: {
    monthlyId: "com.insky.premium.monthly",
    yearlyId: "com.insky.premium.yearlyfinal",
    yearlyTrialId: "com.insky.premium.yearlyfinalpromotional", // 3-day trial offer
    productIdsToQuery: [
      "com.insky.premium.monthly",
      "com.insky.premium.yearlyfinal",
      "com.insky.premium.yearlyfinalpromotional",
    ],
  },
  android: {
    parentId: "premium_subscription",
    basePlanMonthly: "monthly-plan",
    basePlanYearly: "yearly-plan",
    basePlanWeekly: "weekly-plan",
    offerIdMonthlyTrial: "monthly-3day-trial",
    offerIdWeeklyDiscount: "weekly-first-week-25off",
    productIdsToQuery: ["premium_subscription"],
  },
};

// Log configuration for debugging
console.log("📋 SUBSCRIPTION CONFIG - iOS:", {
  monthlyId: SUBSCRIPTION_CONFIG.ios.monthlyId,
  yearlyId: SUBSCRIPTION_CONFIG.ios.yearlyId,
  productIdsToQuery: SUBSCRIPTION_CONFIG.ios.productIdsToQuery,
});

export const ONE_TIME_OFFER_CONFIG = {
  ios: {
    productId: "com.insky.premium.weekly",
  },
  android: {
    parentId: "premium_subscription",
    basePlanId: "weekly-plan",
    offerIdDiscount: "weekly-first-week-25off",
  },
};
