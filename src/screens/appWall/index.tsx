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
  const { t } = useTranslation();
  // 1. Set loading to false so hardcoded data shows immediately
  const [loading, setLoading] = useState(false);
  
  // 2. Hardcode the Yearly Plan
  const [yearlyPlan, setYearlyPlan] = useState<Plan | null>({
    productId: SUBSCRIPTION_CONFIG.ios.yearlyId,
    price: "$29.99",
    isTrial: true,
  });

  // 3. Hardcode the Monthly Plan
  const [monthlyPlan, setMonthlyPlan] = useState<Plan | null>({
    productId: SUBSCRIPTION_CONFIG.ios.monthlyId,
    price: "$9.99",
    isTrial: false,
  });

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

    // 4. Comment out the actual query so we use hardcoded data
    // queryProducts(idsToQuery);
    refetchSubscriptionStatus();

    const productsListener = addBillingListener({
      name: "PRODUCTS_QUERIED",
      cb: ({ products }) => {
        // ... Listener logic remains (but won't fire without queryProducts)
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

        // Logic to parse products (omitted execution since query is commented out)
        if (Platform.OS === "android") {
            // ... (Android parsing logic)
        } else {
            // ... (iOS parsing logic)
        }
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

        // ... Purchase success logs ...

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

    setPurchasing(true);
    // Note: buying will likely fail since products aren't real, but logic is kept intact
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
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
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  container: {
    padding: 24,
    paddingTop: Platform.OS === "android" ? 100 : 30,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },

  header: {
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
    color: "#333333",
    textAlign: "center",
    lineHeight: 34,
    fontFamily: "HelveticaRegular",
  },
  heading: {
    fontSize: 24,
    color: "#111111",
    textAlign: "center",
    lineHeight: 34,
    fontFamily: "HelveticaBold",
  },
  brandHighlight: {
    color: "#6A4CFF",
  },
  headerRestoreText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 15,
  },

  featuresContainer: {
    marginBottom: 30,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 10,
    borderColor: "#E2E2E2",
    borderWidth: 1,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#111111",
    paddingTop: 20,
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
    backgroundColor: "#6C4EFF",
    marginTop: 2,
    padding: 10,
    borderColor: "#6C4EFF",
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#333333",
  },

  plansContainer: {
    gap: 16,
    zIndex: 10,
    marginBottom: 20,
  },

  planCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E2E2",
    borderRadius: 16,
    padding: 20,
    position: "relative",
    height: 70,
    justifyContent: "center",
  },

  planCardActive: {
    borderColor: "#6A4CFF",
    backgroundColor: "#F2F0FF",
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
    color: "#111111",
  },
  planPrice: {
    fontSize: 16,
    color: "#555555",
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
    borderColor: "#999999",
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
    color: "#666666",
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
    backgroundColor: "#CCCCCC",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
