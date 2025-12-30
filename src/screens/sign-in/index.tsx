import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackButton from "@reusable-components/buttons/backButton";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import useInsetsInfo from "@hooks/use-insets-info";
import { signInWithApple, signInWithGoogle } from "@/src/services/auth.service";
import { useOnboardingStore } from "@/src/global-store/onboarding-store";
import { checkUserExists, upsertUser } from "@/src/services/user.service";
import LoadingOverlay from "@/src/reusable-components/misc/LoadingOverlay";
import { zustandMMKVStorage } from "@/src/blue-prints/local-store/mmkvStorageAdapter";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useTranslation } from "@/src/hooks/use-translation";

const trees = require("@assets/images/sign-in/trees.png");
const titleImage = require("@assets/images/sign-in/title.png");
const appleLogo = require("@assets/images/sign-in/apple-logo.png");
const googleLogo = require("@assets/images/sign-in/google-logo.png");

const SignIn: React.FC = () => {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { topInsets } = useInsetsInfo();
  const { t } = useTranslation();
  const {
    skinConcern,
    ageGroup,
    gender,
    skinGoal,
    skinType,
  } = useOnboardingStore();

  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "apple" | null
  >(null);

  const [isUserVerifiying, setUserVerifying] = useState(false);

  const handleBackButtonPress = useCallback(() => {
    router.back();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoadingProvider("google");
    const { data, error } = await signInWithGoogle();
    setLoadingProvider(null);
    if (data && !error) {
      const user = data?.user;
      if (user && user.id) {
        handleUserSignUp(user.id, redirect);
      }
      // Handle success: maybe redirect
    } else {
      // Handle error: show toast or alert
      console.error(error);
    }
  };

  const handleAppleSignIn = async () => {
    setLoadingProvider("apple");
    const { data, error } = await signInWithApple();
    setLoadingProvider(null);
    if (data && !error) {
      console.log({ data });
      const user = data?.user;
      if (user && user.id) {
        handleUserSignUp(user.id, redirect);
      }
      // Handle success
    } else {
      // Handle error
      console.error(error);
    }
  };

  const handleUserSignUp = async (userId: string, redirectPath?: string) => {
    const payload = {
      age_group: ageGroup,
      gender,
      referral_source: referralSource,
      skin_concern: skinConcern,
      skin_goal: skinGoal,
      skin_type: skinType,
    };

    try {
      setUserVerifying(true);
      const { exists } = await checkUserExists(userId);
      const { success, error } = await upsertUser(userId, payload);

      if (success) {
        // Clear persisted onboarding data
        await zustandMMKVStorage.removeItem("onboarding-data");

        // Optionally reset the store too (in memory)
        useOnboardingStore.getState().resetOnboarding();

        if (redirectPath) {
          router.replace(redirectPath);
          return;
        }

        if (exists) {
          router.replace("/(tabs)");
        } else {
          router.replace("/app-wall");
        }
      } else {
        console.error("Failed to save user info:", error);
      }
    } catch (error) {
    } finally {
      setUserVerifying(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: Platform.OS === "ios" ? undefined : topInsets,
        },
      ]}
    >
      {router.canGoBack() && (
        <PageHeader
          showLogo={false}
          showLeftIcon={true} // Controls visibility of left icon
          showRightIcon={false} // Controls visibility of right icon
          onBackPress={handleBackButtonPress}
        />
      )}
      <Image source={trees} style={styles.trees} />
      <Image source={titleImage} style={styles.title} />
      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleSignIn}
          disabled={loadingProvider === "apple"}
        >
          <Image source={appleLogo} />
          {loadingProvider === "apple" ? (
            <ActivityIndicator
              color="#FFFFFF"
              style={{ marginLeft: wp(3.5) }}
            />
          ) : (
            <Text style={styles.socialButtonText}>{t("auth.continueWithApple")}</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.socialButton,
          {
            marginTop: hp(1.8),
            backgroundColor: "#FFFFFF",
          },
        ]}
        onPress={handleGoogleSignIn}
        disabled={loadingProvider === "google"}
      >
        <Image source={googleLogo} />
        {loadingProvider === "google" ? (
          <ActivityIndicator color="#262626" style={{ marginLeft: wp(3.5) }} />
        ) : (
          <Text style={[styles.socialButtonText, { color: "#262626" }]}>
            {t("auth.continueWithGoogle")}
          </Text>
        )}
      </TouchableOpacity>
      {isUserVerifiying && <LoadingOverlay text={t("auth.verifyingUser")} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FCFA",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  trees: {
    width: scaleWidth(402),
    height: scaleHeight(437),
  },
  title: {
    marginTop: Platform.OS === "ios" ? hp(4) : hp(5),
    alignSelf: "center",
    width: scaleWidth(299),
    height: scaleHeight(41),
  },
  socialButton: {
    width: scaleWidth(361),
    height: scaleHeight(66),
    backgroundColor: "#000000",
    borderRadius: 12,
    alignSelf: "center",
    marginTop: hp(3.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  socialButtonText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#FFFFFF",
    marginLeft: wp(3.5),
  },
});

export default SignIn;
