import React, { useRef, useEffect } from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/src/global-store/user-store";
import AppLogo from "@assets/svg/logo/logo.svg";

const Splash: React.FC = () => {
  const {
    hasCompletedFaceScan,
    hasCompletedUserSetup,
    isFreeTrialActive,
    subscriptionStatus,
  } = useUserStore();
  const router = useRouter();

  const animation = useRef<LottieView>(null);

  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  useEffect(() => {
    handleAnimationFinish();
  }, []);

  const handleAnimationFinish = async () => {
    // Wait 2.5 seconds for useUserStore to update
    await new Promise((resolve) => setTimeout(resolve, 2500));

    if (
      (isFreeTrialActive || subscriptionStatus === "ACTIVE") &&
      hasCompletedUserSetup
    ) {
      router.replace("/(tabs)/homeTab/home");
    } else if (hasCompletedUserSetup) {
      router.replace("/app-wall");
    } else {
      router.replace("/foyer/foyer");
    }
  };

  return (
    <View
      style={[
        styles.rootContainer,
        { width: screenWidth, height: screenHeight },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.fullScreenContainer}>
        <AppLogo width={250} height={250} style={{ alignSelf: "center" }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  fullScreenContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  animation: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});

export default Splash;
