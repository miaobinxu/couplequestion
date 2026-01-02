import React, { useState, useCallback } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ProgressBar from "@reusable-components/misc/ProgressBar";
import TenPercentContent from "@screens/onboarding/TenPercentContent";
import TwentyPercentContent from "@screens/onboarding/TwentyPercentContent";
import ThirtyPercentContent from "@screens/onboarding/ThirtyPercentContent";
import FourtyPercentContent from "@screens/onboarding/FourtyPercentContent";

import SeventyPercentContent from "@screens/onboarding/SeventyPercentContent";
import EightyPercentContent from "@screens/onboarding/EightyPercentContent";
import NinetyPercentContent from "@screens/onboarding/NinetyPercentContent";
import BackButton from "@reusable-components/buttons/backButton";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@global-store/onboarding-store";
import useInsetsInfo from "@hooks/use-insets-info";
import { SafeAreaView } from "react-native-safe-area-context";
import FiftyPercentContent from "./FiftyPercentContent";
import SixtyPercentContent from "./SixtyPercentContent";

const OnboardingDynamicStepper: React.FC = () => {
  const router = useRouter();

  const { resetOnboarding } = useOnboardingStore();

  const { topInsets } = useInsetsInfo();

  const [progress, setProgress] = useState<number>(0.1);

  const updateProgressBar = useCallback((progress: number) => {
    setProgress(progress);
  }, []);

  const handleBackButtonPress = useCallback(() => {
    if (progress === 0.1) {
      resetOnboarding();
      router.back();
    } else if (progress === 0.2) {
      setProgress(0.1);
    } else if (progress === 0.3) {
      setProgress(0.2);
    } else if (progress === 0.4) {
      setProgress(0.3);
    } else if (progress === 0.5) {
      setProgress(0.4);
    } else if (progress === 0.6) {
      setProgress(0.5);
    } else if (progress === 0.7) {
      setProgress(0.6);
    } else {
      setProgress(0.6);
    }
  }, [progress]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View
        style={[
          styles.stepperPart,
          {
            marginTop: Platform.OS === "ios" ? undefined : topInsets,
          },
        ]}
      >
        <BackButton onPress={handleBackButtonPress} />
        <View style={styles.progressBarContainer}>
          <ProgressBar progress={progress} />
        </View>
      </View>
      <View style={styles.contentPart}>
        {progress === 0.1 && (
          <TenPercentContent updateProgressBar={updateProgressBar} />
        )}
        {progress === 0.2 && (
          <TwentyPercentContent updateProgressBar={updateProgressBar} />
        )}
        {progress === 0.3 && (
          <ThirtyPercentContent updateProgressBar={updateProgressBar} />
        )}
        {progress === 0.4 && (
          <FourtyPercentContent updateProgressBar={updateProgressBar} />
        )}
        {progress === 0.5 && (
          <FiftyPercentContent updateProgressBar={updateProgressBar} />
         // <SeventyPercentContent updateProgressBar={updateProgressBar} />
        )}
        {progress === 0.6 && (
          <SixtyPercentContent updateProgressBar={updateProgressBar} />
         // <EightyPercentContent updateProgressBar={updateProgressBar} />
        )}
        {(progress === 0.7 ) && (
          <EightyPercentContent updateProgressBar={updateProgressBar} />
         // <NinetyPercentContent progress={progress} updateProgressBar={updateProgressBar}/>
        )}
        {(progress === 0.8  || progress === 1) && (
          <NinetyPercentContent progress={progress} updateProgressBar={updateProgressBar}/>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  stepperPart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  progressBarContainer: {
    marginLeft: wp(4),
  },
  contentPart: {
    flex: 12,
  },
});

export default OnboardingDynamicStepper;
