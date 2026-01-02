import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";
import {
  queryProducts,
  buySubscription,
  addBillingListener,
  restorePurchases,
  checkSubscriptionActive,
} from "@/src/services/native/billing";
import { useRouter } from "expo-router";
import showToast from "@/src/utilities/toastUtil";
import { useUserStore } from "@/src/global-store/user-store";
import { useFocusEffect } from "expo-router";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import HeartPaywall from "@assets/svg/appWall/heart-paywall.svg";
import InsightsPaywall from "@assets/svg/appWall/insights-paywall.svg";
import LifePaywall from "@assets/svg/appWall/life-paywall.svg";
import Starpaywall from "@assets/svg/appWall/starpaywall.svg";
import { SUBSCRIPTION_CONFIG } from "@/src/config/subscription";
import hapticFeedback from "@/src/utilities/hapticUtil";

type Plan = {
  productId: string;
  offerToken?: string;
  price: string;
  isTrial?: boolean;
};

export default function AppWall() {
  // ... (Logic remains exactly the same) ...

  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [yearlyPlan, setYearlyPlan] = useState<Plan | null>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<Plan | null>(null);
  const [selected, setSelected] = useState<"yearly" | "monthly">("yearly");
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const router = useRouter();
  const { refetchSubscriptionStatus, updateUser } = useUserStore.getState();

  const checkAndRedirect = useCallback(async () => {
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

      if (isActive) {
        refetchSubscriptionStatus();
        router.replace("/(tabs)/homeTab/home");
        return true;
      }
    } catch (e) {}
    return false;
  }, [router, refetchSubscriptionStatus]);

  useFocusEffect(
    useCallback(() => {
      checkAndRedirect();
    }, [checkAndRedirect])
  );

  useEffect(() => {
    const idsToQuery =
      Platform.OS === "ios"
        ? SUBSCRIPTION_CONFIG.ios.productIdsToQuery
        : SUBSCRIPTION_CONFIG.android.productIdsToQuery;

    if (Platform.OS === "ios") {
      console.log("\n=== 🍎 APPLE APP STORE - PRODUCT QUERY ===");
      console.log("📦 iOS Product IDs:", idsToQuery);
      console.log("==========================================\n");
    } else {
      console.log("\n=== 🤖 GOOGLE PLAY STORE - PRODUCT QUERY ===");
      console.log("📦 Android Product IDs:", idsToQuery);
      console.log("============================================\n");
    }

    queryProducts(idsToQuery);
    refetchSubscriptionStatus();

    const productsListener = addBillingListener({
      name: "PRODUCTS_QUERIED",
      cb: ({ products }) => {
        if (Platform.OS === "ios") {
          console.log("\n=== 🍎 APPLE APP STORE - PRODUCTS RECEIVED ===");
          console.log("📊 iOS Products Found:", products.length);
          products.forEach((product, index) => {
            console.log(
              `   ${index + 1}. ${product.title} - ${product.price} (${
                product.productId
              })`
            );
          });
          console.log("===============================================\n");
        } else {
          console.log("\n=== 🤖 GOOGLE PLAY STORE - PRODUCTS RECEIVED ===");
          console.log("📊 Android Products Found:", products.length);
          products.forEach((product, index) => {
            console.log(
              `   ${index + 1}. ${product.title} - ID: ${product.productId}`
            );
          });
          console.log("=================================================\n");
        }

        if (products.length === 0) {
          console.log(
            "❌ No products found - check product IDs in App Store Connect"
          );
          setError("No products found");
          setLoading(false);
          return;
        }

        if (Platform.OS === "android") {
          console.log("🤖 Processing Android Play Store products...");
          const product = products.find(
            (p) => p.productId === SUBSCRIPTION_CONFIG.android.parentId
          );
          console.log("🔍 Found Android product:", product);

          if (product && product.subscriptionOfferDetails) {
            console.log(
              "📋 Android subscription offer details:",
              product.subscriptionOfferDetails
            );

            const monthlyOffer = product.subscriptionOfferDetails.find(
              (o) =>
                o.basePlanId === SUBSCRIPTION_CONFIG.android.basePlanMonthly
            );
            if (monthlyOffer) {
              console.log("📅 Android monthly offer found:", monthlyOffer);
              setMonthlyPlan({
                productId: product.productId,
                offerToken: monthlyOffer.offerToken,
                price: monthlyOffer.pricingPhases[0].formattedPrice,
              });
            }

            const yearlyOffer = product.subscriptionOfferDetails.find(
              (o) => o.basePlanId === SUBSCRIPTION_CONFIG.android.basePlanYearly
            );
            if (yearlyOffer) {
              console.log("📆 Android yearly offer found:", yearlyOffer);
              const phases = yearlyOffer.pricingPhases;
              const recurringPhase =
                phases.find((p) => p.priceAmountMicros > 0) ||
                phases[phases.length - 1];
              setYearlyPlan({
                productId: product.productId,
                offerToken: yearlyOffer.offerToken,
                price: recurringPhase.formattedPrice,
                isTrial:
                  yearlyOffer.offerId ===
                    SUBSCRIPTION_CONFIG.android.offerIdMonthlyTrial &&
                  phases[0].priceAmountMicros === 0,
              });
            }
          }
        } else {
          const iosMonthly = products.find(
            (p) => p.productId === SUBSCRIPTION_CONFIG.ios.monthlyId
          );
          const iosYearly = products.find(
            (p) => p.productId === SUBSCRIPTION_CONFIG.ios.yearlyId
          );
          const iosYearlyTrial = products.find(
            (p) => p.productId === SUBSCRIPTION_CONFIG.ios.yearlyTrialId
          );

          console.log(
            "✅ iOS Monthly Plan:",
            iosMonthly
              ? `${iosMonthly.price} (${iosMonthly.productId})`
              : "❌ Not Found"
          );
          console.log(
            "✅ iOS Yearly Plan:",
            iosYearly
              ? `${iosYearly.price} (${iosYearly.productId})`
              : "❌ Not Found"
          );
          console.log(
            "✅ iOS Trial Plan:",
            iosYearlyTrial
              ? `${iosYearlyTrial.price} (${iosYearlyTrial.productId})`
              : "❌ Not Found"
          );

          if (iosMonthly) {
            setMonthlyPlan({
              productId: iosMonthly.productId,
              price: iosMonthly.price || "$9.99",
            });
          }

          // Prefer trial version if available, otherwise use regular yearly
          const yearlyProduct = iosYearlyTrial || iosYearly;

          if (yearlyProduct) {
            const isTrial =
              yearlyProduct.productId === SUBSCRIPTION_CONFIG.ios.yearlyTrialId;
            setYearlyPlan({
              productId: yearlyProduct.productId,
              price: yearlyProduct.price || "$29.99",
              isTrial,
            });
          }
        }

        console.log("\n=== ✅ STORE SETUP COMPLETE ===");
        if (Platform.OS === "ios") {
          console.log("🍎 iOS App Store Plans:");
        } else {
          console.log("🤖 Android Play Store Plans:");
        }
        console.log(
          `   Monthly: ${monthlyPlan ? "✅ Ready" : "❌ Not Available"}`
        );
        console.log(
          `   Yearly: ${yearlyPlan ? "✅ Ready" : "❌ Not Available"}`
        );
        console.log("==============================\n");
        setLoading(false);
      },
    });

    const successListener = addBillingListener({
      name: "PURCHASE_SUCCESS",
      cb: ({ productId, purchaseData }) => {
        if (Platform.OS === "ios") {
          console.log("\n=== ✅ iOS PURCHASE SUCCESSFUL ===");
          console.log("🎉 iOS Product ID:", productId);
        } else {
          console.log("\n=== ✅ ANDROID PURCHASE SUCCESSFUL ===");
          console.log("🎉 Android Product ID:", productId);
        }

        // Log detailed purchase information
        console.log("\n📋 PURCHASE DETAILS:");
        console.log("   Product ID:", productId);
        console.log("   Selected Plan:", selected);
        console.log(
          "   Plan Price:",
          selected === "yearly" ? yearlyPlan?.price : monthlyPlan?.price
        );
        console.log(
          "   Is Trial:",
          selected === "yearly" ? yearlyPlan?.isTrial : false
        );
        console.log("   Platform:", Platform.OS);
        console.log("   Timestamp:", new Date().toISOString());

        // Log raw purchase data if available
        if (purchaseData) {
          console.log("\n💳 RAW PURCHASE DATA:");
          console.log(JSON.stringify(purchaseData, null, 2));
        }

        // Log user context
        const userState = useUserStore.getState();
        console.log("\n👤 USER CONTEXT:");
        console.log("   User ID:", userState.user?.id || "Unknown");
        console.log("   Email:", userState.user?.email || "Unknown");
        console.log(
          "   Previous Subscription:",
          userState.user?.subscriptionStatus || "None"
        );

        console.log("\n🏠 Redirecting to home...");
        console.log("=============================\n");

        setPurchasing(false);
        refetchSubscriptionStatus();
        setTimeout(() => {
          updateUser({
            hasCompletedUserSetup: true,
            subscriptionStatus: "ACTIVE",
          });
          router.replace("/(tabs)/homeTab/home");
        }, 1500);
      },
    });

    const errorListener = addBillingListener({
      name: "PURCHASE_FAILED",
      cb: ({ message }) => {
        if (Platform.OS === "ios") {
          console.log("\n=== ❌ iOS PURCHASE FAILED ===");
          console.log("💥 iOS Error:", message);
        } else {
          console.log("\n=== ❌ ANDROID PURCHASE FAILED ===");
          console.log("💥 Android Error:", message);
        }
        console.log("=========================\n");
        setPurchasing(false);
        showToast("error", {
          title: "Purchase Failed",
          message: message ?? "Could not complete transaction.",
        });
      },
    });

    const restoreListener = addBillingListener({
      name: "PURCHASES_RESTORED",
      cb: (data) => {
        console.log(
          "🔄 Restore purchases data:",
          JSON.stringify(data, null, 2)
        );
        const restoredIds = data.purchases.map((p: any) =>
          typeof p === "string" ? p : p.productId
        );
        console.log("📋 Restored product IDs:", restoredIds);

        const hasPremium = restoredIds.some(
          (id) =>
            id === SUBSCRIPTION_CONFIG.android.parentId ||
            id === SUBSCRIPTION_CONFIG.ios.monthlyId ||
            id === SUBSCRIPTION_CONFIG.ios.yearlyId
        );

        console.log("🔍 Has premium subscription:", hasPremium);

        if (hasPremium) {
          console.log("✅ Premium subscription found, restoring access");
          showToast("success", {
            title: "Restored",
            message: "Subscription active.",
          });
          refetchSubscriptionStatus();
          setTimeout(() => {
            updateUser({ hasCompletedUserSetup: true });
            router.replace("/(tabs)/homeTab/home");
          }, 1500);
        } else {
          console.log("❌ No premium subscription found");
          showToast("info", {
            title: "No Subscription",
            message: "No active plan found.",
          });
        }
      },
    });

    const cancelListener = addBillingListener({
      name: "PURCHASE_CANCELLED",
      cb: () => {
        console.log("🚫 Purchase cancelled by user");
        setPurchasing(false);
        router.replace("/app-wall/one-time-offer");
      },
    });

    return () => {
      productsListener.remove();
      successListener.remove();
      errorListener.remove();
      restoreListener.remove();
      cancelListener.remove();
    };
  }, []);

  const handlePurchase = () => {
    const plan = selected === "yearly" ? yearlyPlan : monthlyPlan;

    if (!plan) {
      console.log("❌ No plan available for purchase");
      return;
    }

    hapticFeedback.medium();

    if (Platform.OS === "ios") {
      console.log("\n=== 💳 iOS PURCHASE INITIATED ===");
      console.log("🍎 iOS Selected Plan:", selected);
    } else {
      console.log("\n=== 💳 ANDROID PURCHASE INITIATED ===");
      console.log("🤖 Android Selected Plan:", selected);
    }
    console.log("💰 Plan Price:", plan.price);
    console.log("🆔 Product ID:", plan.productId);
    console.log("🏆 Is Trial:", plan.isTrial || false);
    console.log("📱 Platform:", Platform.OS);

    // Log user information at purchase time
    const userState = useUserStore.getState();
    console.log("\n👤 USER PURCHASE CONTEXT:");
    console.log("   User ID:", userState.user?.id || "Unknown");
    console.log("   Email:", userState.user?.email || "Unknown");
    console.log(
      "   Current Status:",
      userState.user?.subscriptionStatus || "None"
    );
    console.log(
      "   Has Completed Setup:",
      userState.user?.hasCompletedUserSetup || false
    );

    // Log offer token for Android
    if (Platform.OS === "android" && plan.offerToken) {
      console.log("🎫 Offer Token:", plan.offerToken);
    }

    console.log("\n🚀 Starting purchase flow...");
    console.log("==============================\n");

    setPurchasing(true);
    buySubscription(plan.productId, plan.offerToken);
  };

  const handleRestorePurchases = () => {
    console.log("🔄 Attempting to restore purchases...");
    restorePurchases();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A4CFF" />
      </View>
    );
  }

 {/* return <SafeAreaView style={styles.safeArea}>
    <Pressable onPress={() => router.replace("/(tabs)/homeTab/home")}><Text style={{color: 'white', fontSize: 50}}>Hi</Text></Pressable>
    
  </SafeAreaView> */}

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        // iOS requires this to allow the badge to hang outside the scroll view area if needed,
        // though usually proper padding inside handles it.
        overScrollMode="never"
        bounces={true}
      >
        <View style={styles.restoreHeader}>
          <TouchableOpacity onPress={handleRestorePurchases}>
            <Text style={styles.restoreHeading}>Restore</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.heading}>
            Everything is ready
          </Text>
          <Text style={styles.subHeading}>Unlock Couples for free</Text>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureItem
            IconComponent={LifePaywall}
            iconName="FeatureItem"
            text="3,000+ psychology-backed questions"
          />
          <FeatureItem
            IconComponent={HeartPaywall}
            iconName="heart"
            text="4 unique modes: Soulmate, Spicy, Long Distance & more"
          />
          <FeatureItem
            IconComponent={InsightsPaywall}
            iconName="message-circle"
            text="Fun games & quizzes to play together"
          />
          <FeatureItem
            IconComponent={Starpaywall}
            iconName="star"
            text="Unlimited access, no waiting"
          />
        </View>

        {/* Added zIndex to plansContainer to ensure badges sit on top of everything */}
        <View style={styles.plansContainer}>
          {yearlyPlan && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.planCard,
                selected === "yearly" && styles.planCardActive,
              ]}
              onPress={() => {
                hapticFeedback.light();
                setSelected("yearly");
              }}
            >
              {yearlyPlan?.isTrial && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>3 Days Free</Text>
                </View>
              )}
              <View style={styles.planContent}>
                <View style={styles.radioRow}>
                  <RadioButton selected={selected === "yearly"} />
                  <Text style={styles.planTitle}>Yearly Plan</Text>
                </View>
                <Text style={styles.planPrice}>{yearlyPlan.price}</Text>
              </View>
            </TouchableOpacity>
          )}

          {monthlyPlan && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.planCard,
                selected === "monthly" && styles.planCardActive,
              ]}
              onPress={() => {
                hapticFeedback.light();
                setSelected("monthly");
              }}
            >
              <View style={styles.planContent}>
                <View style={styles.radioRow}>
                  <RadioButton selected={selected === "monthly"} />
                  <Text style={styles.planTitle}>Monthly Plan</Text>
                </View>
                <Text style={styles.planPrice}>{monthlyPlan.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, purchasing && styles.ctaButtonDisabled]}
          onPress={handlePurchase}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaText}>
              {selected === "yearly"
                ? true //yearlyPlan?.isTrial
                  ? t("appWall.startTrial")
                  : t("appWall.startYearly")
                : t("appWall.startMonthly")}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>{t("appWall.disclaimer")}</Text>
      </View>
    </SafeAreaView>
  );
}

// ... FeatureItem and RadioButton helper components ...
const FeatureItem = ({ IconComponent, iconName, text }: any) => (
  <View style={styles.featureRow}>
    <View style={styles.iconContainer}>
      <IconComponent size={20} color="#fffff" />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);
const RadioButton = ({ selected }: { selected: boolean }) => (
  <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
    {selected && (
      <Feather name="check" size={12} color="#FFFFFF" strokeWidth={4} />
    )}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },

  container: {
    padding: 24,
    paddingTop: Platform.OS === "android" ? 100 : 30,
    paddingBottom: 40,
    backgroundColor: "#000000",
  },

  header: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  restoreHeader: {
    position: "absolute",
    right: 40,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  restoreHeading: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 34,
    fontFamily: "HelveticaRegular",
  },
  heading: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 34,
    fontFamily: "HelveticaBold",
  },
  brandHighlight: {
    color: "#6A4CFF",
  },
  headerRestoreText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },

  featuresContainer: {
    marginBottom: 30,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 10,
    borderColor: "#rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
    paddingTop: 20
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    marginVertical: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginTop: 2,
    padding: 10,
    borderColor: "#rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#FFFFFF",
  },

  plansContainer: {
    gap: 16,
    zIndex: 10,
    marginBottom: 20,
  },

  planCard: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1.5,
    borderColor: "#333333",
    borderRadius: 16,
    padding: 20,
    position: "relative",
    height: 70,
    justifyContent: "center",
  },

  planCardActive: {
    borderColor: "#6A4CFF",
    backgroundColor: "#1A1A1A",
  },

  planContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  planPrice: {
    fontSize: 16,
    color: "#CCCCCC",
    fontWeight: "500",
  },

  badgeContainer: {
    position: "absolute",
    top: -12,
    right: -1,
    backgroundColor: "#6A4CFF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 20,
    overflow: "hidden",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#666666",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    backgroundColor: "#6A4CFF",
    borderColor: "#6A4CFF",
  },

  footer: {
    marginBottom: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  disclaimer: {
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 12,
    textAlign: "center",
  },

  ctaButton: {
    backgroundColor: "#6A4CFF",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaButtonDisabled: {
    backgroundColor: "#333333",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
