import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform, // 1. Platform import
} from "react-native";
import {
  queryProducts,
  buySubscription,
  addBillingListener,
} from "@/src/services/native/billing";
import { useRouter } from "expo-router";
import showToast from "@/src/utilities/toastUtil";
import { useUserStore } from "@/src/global-store/user-store";
import { supabase } from "@/src/utilities/supabase";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ONE_TIME_OFFER_CONFIG } from "@/src/config/subscription";

type Plan = {
  productId: string;
  offerToken?: string; // Optional for iOS
  price: string; // Monthly price (calculated)
  annualPrice: string; // Full annual price text
};

export default function OneTimeOffer() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [offerPlan, setOfferPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refetchSubscriptionStatus, hasCompletedUserSetup, updateUser } =
    useUserStore();

  useEffect(() => {
    // 3. Query Logic based on Platform
    const idToQuery =
      Platform.OS === "ios"
        ? [ONE_TIME_OFFER_CONFIG.ios.productId]
        : [ONE_TIME_OFFER_CONFIG.android.parentId];

    queryProducts(idToQuery);

    const productsListener = addBillingListener({
      name: "PRODUCTS_QUERIED",
      cb: ({ products }) => {
        let foundOffer = false;

        // === ANDROID LOGIC ===
        if (Platform.OS === "android") {
          const product = products.find(
            (p) => p.productId === ONE_TIME_OFFER_CONFIG.android.parentId
          );

          if (product && product.subscriptionOfferDetails) {
            const offer = product.subscriptionOfferDetails.find(
              (o) => o.basePlanId == ONE_TIME_OFFER_CONFIG.android.basePlanId
            );

            if (offer && offer.pricingPhases[0]) {
              const pricingPhase = offer.pricingPhases[0];
              const monthlyRaw =
                pricingPhase.priceAmountMicros / 1_000_000 / 12;

              const monthlyFormatted = new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: pricingPhase.priceCurrencyCode,
              }).format(monthlyRaw);

              setOfferPlan({
                productId: product.productId,
                offerToken: offer.offerToken,
                price: monthlyFormatted,
                annualPrice: t("oneTimeOffer.billedAt", {
                  price: pricingPhase.formattedPrice,
                }),
              });
              foundOffer = true;
            }
          }
        }

        // === iOS LOGIC ===
        else {
          const product = products.find(
            (p) => p.productId === ONE_TIME_OFFER_CONFIG.ios.productId
          );

          if (product) {
            // iOS sends priceAmount (e.g., 19.99) and price (e.g., "9.99")
            const priceAmount = product.priceAmount || 0;
            const currency = product.currency || "USD";

            // Calculate Monthly breakdown
            const monthlyRaw = priceAmount / 12;
            const monthlyFormatted = new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: currency,
            }).format(monthlyRaw);

            setOfferPlan({
              productId: product.productId,
              offerToken: undefined, // No token needed for iOS
              price: monthlyFormatted,
              annualPrice: t("oneTimeOffer.billedAt", { price: product.price }),
            });
            foundOffer = true;
          }
        }

        if (!foundOffer) {
          // If product not found, we show error but allow user to skip
          setError(t("oneTimeOffer.unavailable"));
        }
        setLoading(false);
      },
    });

    const successListener = addBillingListener({
      name: "PURCHASE_SUCCESS",
      cb: async ({ productId }) => {
        refetchSubscriptionStatus();
        setTimeout(() => {
          updateUser({ hasCompletedUserSetup: true });
          router.replace("/(tabs)/homeTab/home");
        }, 3000);
      },
    });

    const failListener = addBillingListener({
      name: "PURCHASE_FAILED",
      cb: ({ message }) => {
        // Corrected destructing based on previous wrapper
        showToast("error", {
          title: "Purchase Failed",
          message: message || "Something went wrong. Please try again.",
        });
      },
    });

    // Handle Cancel - Keep them on screen
    const cancelListener = addBillingListener({
      name: "PURCHASE_CANCELLED",
      cb: () => {
        console.log("User cancelled one-time offer purchase");
      },
    });

    return () => {
      productsListener.remove();
      successListener.remove();
      failListener.remove();
      cancelListener.remove();
    };
  }, [router, refetchSubscriptionStatus, hasCompletedUserSetup, updateUser, t]);

  const handlePurchase = async () => {
    if (!offerPlan) return;

    // Optional: Check session if needed
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // iOS will ignore the second argument (undefined)
    buySubscription(offerPlan.productId, offerPlan.offerToken);
  };

  const handleSkip = () => {
    // If they skip the offer, send them to main Paywall (AppWall)
    router.replace("/app-wall");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.mainBackground}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.contentArea}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{t("oneTimeOffer.title")}</Text>
              <Text style={styles.sub}>{t("oneTimeOffer.subtitle")}</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleSkip}
                >
                  <Text style={styles.continueButtonText}>
                    {t("oneTimeOffer.continueToPlans")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cardContainer}>
                <View style={styles.giftIconContainer}>
                  <View style={styles.giftIconBackground}>
                    <Feather name="gift" size={35} color="#fff" />
                  </View>
                </View>

                <View style={styles.card}>
                  <View style={styles.discountContainer}>
                    <Text style={styles.discountText}>
                      {t("oneTimeOffer.heresA")}
                    </Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountBadgeText}>
                        {t("oneTimeOffer.discount")}
                      </Text>
                    </View>
                    <Text style={styles.discountText}>
                      {t("oneTimeOffer.discountSuffix")}
                    </Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <View style={styles.priceDisplay}>
                      <Text style={styles.priceText}>
                        {t("oneTimeOffer.pricePerWeek", {
                          price: offerPlan?.price ?? ".66",
                        })}
                      </Text>
                    </View>
                    <Text style={styles.lowestPrice}>
                      {t("oneTimeOffer.lowestPrice")}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Footer Area */}
          {!error && (
            <View style={styles.footerContainer}>
              {/* <Text style={styles.noCommitmentText}>
                {t("oneTimeOffer.noCommitment")}
              </Text> */}

              <TouchableOpacity
                style={[styles.ctaButton, !offerPlan && styles.ctaDisabled]}
                onPress={handlePurchase}
                disabled={!offerPlan}
              >
                <Text style={styles.ctaButtonText}>
                  {t("oneTimeOffer.claimOffer")}
                </Text>
              </TouchableOpacity>

              <Text style={styles.noCommitmentText}>
                {t("oneTimeOffer.noCommitment")}
              </Text>

              {offerPlan && (
                <Text style={styles.billingText}>
                  {offerPlan.annualPrice ?? t("oneTimeOffer.billedAnnually")}
                </Text>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: "#000000",
  },
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
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#000000",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  contentArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    fontFamily: "HelveticaBold",
  },
  sub: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 20,
    right: 10,
    padding: 10,
    zIndex: 20,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  giftIconContainer: {
    position: "absolute",
    top: -40,
    zIndex: 10,
    alignItems: "center",
  },
  giftIconBackground: {
    backgroundColor: "#6A4CFF",
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
    borderColor: "#rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  discountText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginTop: 50,
  },
  discountBadge: {
    backgroundColor: "#fd9e1c",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginTop: 50,
    marginHorizontal: 4,
  },
  discountBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  priceDisplay: {
    backgroundColor: "#f4f7f4",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 6,
    padding: 30,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  lowestPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    paddingTop: 10,
  },
  footerContainer: {
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
    marginBottom: 10,
  },
  noCommitmentText: {
    color: "#666",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#6A4CFF",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  billingText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 0,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#666",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
