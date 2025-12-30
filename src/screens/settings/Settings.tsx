import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Platform,
  Share,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useRouter } from "expo-router";
import ArrowRight from "@assets/svg/settings/arrow-white-outlined.svg";
import DeleteIcon from "@assets/svg/settings/delete.svg";
import LoadingOverlay from "@/src/reusable-components/misc/LoadingOverlay";
import ConfirmationModal from "@/src/reusable-components/misc/ConfirmationModal.tsx";
import { useUserStore } from "@/src/global-store/user-store";
import { useTranslation } from "@/src/hooks/use-translation";
import { useOnboardingStore } from "@/src/global-store/onboarding-store";
import { useScanStore } from "@/src/global-store/scan-store";
import useChecklistStore from "@/src/global-store/useChecklist-store";
import * as Application from "expo-application";
import { deleteScannedImagesFolder } from "@/src/utilities/common";
import * as Updates from "expo-updates";
import showToast from "@/src/utilities/toastUtil";
import { supabase } from "@/src/utilities/supabase";
import {
  addBillingListener,
  restorePurchases,
} from "@/src/services/native/billing";

const APP_STORE_LINK = process.env.EXPO_PUBLIC_APPSTORE_LINK!;
const PLAY_STORE_LINK = process.env.EXPO_PUBLIC_PLAYSTORE_LINK!;
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL!;
const TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL!;
const PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL!;

// --------------------
// Types
// --------------------

type SettingsItemType = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
};

type SettingsSectionType = {
  title: string;
  items: SettingsItemType[];
};

// --------------------
// Components
// --------------------

const SettingsSection: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SettingsItem: React.FC<SettingsItemType> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Text style={styles.itemText}>{label}</Text>
    <ArrowRight color="#ffffff" />
  </TouchableOpacity>
);

// --------------------
// Main Settings Screen
// --------------------

const Settings: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { resetUser } = useUserStore();
  const { resetOnboarding } = useOnboardingStore();
  const { resetScanData } = useScanStore();
  const { resetChecklistData } = useChecklistStore();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    const restoreListener = addBillingListener({
      name: "PURCHASES_RESTORED",
      cb: async ({ purchases }) => {
        if (!purchases || purchases.length === 0) {
          showToast("info", {
            title: t("settings.toasts.noPurchasesFound.title"),
            message: t("settings.toasts.noPurchasesFound.message"),
          });
          return;
        }

        setIsRestoring(true);

        // Native module already validates purchases,
        // so if purchases exist, they are verified.
        let aPurchaseVerified = purchases.length > 0;

        setIsRestoring(false);

        if (aPurchaseVerified) {
          showToast("success", {
            title: t("settings.toasts.purchasesRestored.title"),
            message: t("settings.toasts.purchasesRestored.message"),
          });
        } else {
          showToast("info", {
            title: t("settings.toasts.noPurchasesFound.title"),
            message: t("settings.toasts.noPurchasesFound.message"),
          });
        }
      },
    });

    return () => {
      restoreListener.remove();
    };
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        showToast("error", {
          title: t("settings.toasts.logoutFailed.title"),
          message: error.message,
        });
      } else {
        // Reset stores on successful logout
        resetUser();
        resetOnboarding();
        resetScanData();
        resetChecklistData();
        router.replace("/foyer/foyer");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error("Unexpected error during logout:", errorMessage);
      showToast("error", {
        title: t("settings.toasts.logoutFailed.title"),
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    setLoading(true); // Show loader
    resetUser();
    resetOnboarding();
    resetScanData();
    resetChecklistData();
    await deleteScannedImagesFolder();
    setTimeout(() => {
      showToast("success", {
        title: t("settings.accountDeleted"),
        message: t("settings.accountDeletedMessage"),
      });
    }, 2000);
    setTimeout(() => {
      setLoading(false);
      Updates.reloadAsync();
    }, 4000);
    // router.replace("/foyer/foyer");
  };

  // --------------------
  // Data
  // --------------------

  const handleShareApp = async () => {
    const message =
      Platform.OS === "ios"
        ? `Download the UpSkin app from the App Store: ${APP_STORE_LINK}`
        : `Download the UpSkin app from the Play Store: ${PLAY_STORE_LINK}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing the app:", error);
    }
  };

  const openSupportEmail = () => {
    const subject = t("settings.email.subject");
    const body = t("settings.email.body");
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).catch((err) => {
      console.error("Failed to open mail client:", err);
    });
  };

  const openWebView = (url: string, title: string) => {
    router.push({
      pathname: "/webview",
      params: { url, title },
    });
  };

  const settingsSections: SettingsSectionType[] = [
    {
      title: t("settings.customizations"),
      items: [
        {
          label: t("settings.myProfile"),
          onPress: () => router.push("/my-profile"),
        },
        // {
        //   label: t("settings.skinProfile"),
        //   onPress: () => router.push("/skin-profile"),
        // },
        // {
        //   label: t("settings.customizeDailyRoutine"),
        //   onPress: () => router.push("/daily-routines"),
        // },
        // {
        //   label: t("settings.scanHistory"),
        //   onPress: () => router.push("/scan-history"),
        // },
      ],
    },
    {
      title: t("settings.general"),
      items: [
        // {
        //     label: "Restore Purchases",
        //     onPress: () => restorePurchases(),
        // },
        {
          label: t("settings.shareApp"),
          onPress: handleShareApp,
        },
        {
          label: t("settings.termsAndConditions"),
          onPress: () =>
            openWebView(TERMS_URL, t("settings.termsAndConditions")),
        },
        {
          label: t("settings.privacyPolicy"),
          onPress: () => openWebView(PRIVACY_URL, t("settings.privacyPolicy")),
        },

        { label: t("settings.supportEmail"), onPress: openSupportEmail },

        // { label: "Log out", onPress: () => setShowLogoutModal(true) },

        // { label: "Delete Account", onPress: () => setShowDeleteModal(true) },
        // ...(Platform.OS === "ios"
        //   ? [
        //       {
        //         label: t("settings.deleteAccount"),
        //         onPress: () => setShowDeleteModal(true),
        //       },
        //     ]
        //   : []),
      ],
    },
  ];
  return (
    <>
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{t("settings.title")}</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainerStyle}
          >
            {settingsSections.map((section, index) => (
              <View key={index}>
                <SettingsSection title={section.title} />
                <View style={styles.sectionContainer}>
                  {section.items.map((item, idx) => (
                    <SettingsItem key={idx} {...item} />
                  ))}
                </View>
              </View>
            ))}

            {/* <Text style={styles.version}>
              VERSION {Application.nativeApplicationVersion}
            </Text> */}
          </ScrollView>
        </SafeAreaView>
        <ConfirmationModal
          visible={showLogoutModal}
          title={t("settings.modals.confirmLogout.title")}
          message={t("settings.modals.confirmLogout.message")}
          confirmButtonText={t("settings.modals.confirmLogout.confirmButton")}
          confirmButtonColor="#D30000"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
        <ConfirmationModal
          visible={showDeleteModal}
          title={t("settings.modals.confirmDelete.title")}
          message={t("settings.modals.confirmDelete.message")}
          confirmButtonText={t("settings.modals.confirmDelete.confirmButton")}
          confirmButtonColor="#D30000"
          confirmButtonIcon={<DeleteIcon height={17} width={17} />}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      </View>
      {(loading || isRestoring) && (
        <LoadingOverlay
          text={isRestoring ? t("settings.loading.restoringPurchases") : t("settings.loading.deletingAccount")}
        />
      )}
    </>
  );
};

export default Settings;

// --------------------
// Styles
// --------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    padding: wp(5),
    paddingVertical: wp(3),
    paddingBottom: 0,
    marginTop: hp(5),
    marginVertical: hp(2),
  },
  headerText: {
    fontFamily: "CormorantGaramondBold",
    fontSize: scaleFont(32),
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainerStyle: {
    marginHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  sectionTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(18),
    color: "#FFFFFF",
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  sectionContainer: {
    //backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingHorizontal: wp(4),
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    //borderBottomColor: "#333333",
  },
  itemText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
  },
  arrow: {
    fontSize: scaleFont(16),
    color: "#ffffff",
  },
  version: {
    textAlign: "left",
    marginTop: hp(4),
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#666666",
  },
});
