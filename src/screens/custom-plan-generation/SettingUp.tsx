import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  BackHandler,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import ProgressBar from "@reusable-components/misc/ProgressBar";
import * as Haptics from "expo-haptics";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import { useUserStore } from "@/src/global-store/user-store";
import { useOnboardingStore } from "@/src/global-store/onboarding-store";
import { useTranslation } from "@/src/hooks/use-translation";

import Progress from "@assets/svg/Progress.svg"

const SettingUp: React.FC = () => {
  // to disable back button press on Android (we don't allow going back to the previous screen)
  const onBackPress = useCallback(() => true, []);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  const router = useRouter();
  const { t } = useTranslation();

  const { updateUser, subscriptionStatus, isFreeTrialActive } = useUserStore();
  const { birthDate } = useOnboardingStore();

  // Function to get zodiac sign based on birth date
  const getZodiacSign = (date: Date): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "aries"; // default
    }

    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return "gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return "cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return "libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return "scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return "sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return "pisces";

    return "aries"; // fallback
  };

  // Get zodiac animation source
  const getZodiacAnimation = (zodiacSign: string) => {
    const zodiacAnimations: Record<string, any> = {
      aries: require("@assets/lottie_animations/zodiac/aries.json"),
      taurus: require("@assets/lottie_animations/zodiac/taurus.json"),
      gemini: require("@assets/lottie_animations/zodiac/gemini.json"),
      cancer: require("@assets/lottie_animations/zodiac/cancer.json"),
      leo: require("@assets/lottie_animations/zodiac/leo.json"),
      virgo: require("@assets/lottie_animations/zodiac/virgo.json"),
      libra: require("@assets/lottie_animations/zodiac/libra.json"),
      scorpio: require("@assets/lottie_animations/zodiac/Scorpio.json"),
      sagittarius: require("@assets/lottie_animations/zodiac/sagittarius.json"),
      capricorn: require("@assets/lottie_animations/zodiac/capricorn.json"),
      aquarius: require("@assets/lottie_animations/zodiac/aquarius.json"),
      pisces: require("@assets/lottie_animations/zodiac/pisces.json"),
    };
    return zodiacAnimations[zodiacSign] || zodiacAnimations.aries;
  };

  const userZodiacSign = getZodiacSign(birthDate || new Date());
  const zodiacAnimationSource = getZodiacAnimation(userZodiacSign);

  // Debug logging
  // console.log("Birth Date:", birthDate);
  // console.log("Calculated Zodiac Sign:", userZodiacSign);
  // console.log("Animation Source:", zodiacAnimationSource);

  const [percentage, setPercentage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [textIndex, setTextIndex] = useState<number>(0);

  const texts: string[] = [
    t("customPlanGeneration.settingUp.calculatingChart"),
    t("customPlanGeneration.settingUp.mappingPlacements"),
    t("customPlanGeneration.settingUp.interpretingPlacements"),
    t("customPlanGeneration.settingUp.personalizingTips"),
    t("customPlanGeneration.settingUp.personalizingGuidance"),
    "",
  ];

  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    // define the parts of the animation with their timing details (total 6.22 seconds)
    const parts = [
      { start: 0, end: 1.83, startPercentage: 0, endPercentage: 25 },
      { start: 1.83, end: 3.18, startPercentage: 25, endPercentage: 50 },
      { start: 3.18, end: 4.8, startPercentage: 50, endPercentage: 75 },
      { start: 4.8, end: 6.22, startPercentage: 75, endPercentage: 100 },
    ];

    // array to store all timeouts so we can clear them later
    const timeouts: NodeJS.Timeout[] = [];

    // process each part
    parts.forEach((part) => {
      const duration = part.end - part.start; // duration of this part in seconds
      const incrementCount = part.endPercentage - part.startPercentage; // number of increments in this part
      const intervalMs = (duration * 1000) / incrementCount; // interval in ms for each increment

      // create a timeout for each increment in this part
      for (let i = 1; i <= incrementCount; i++) {
        const timeoutMs = part.start * 1000 + i * intervalMs; // when this increment should happen
        const timeout = setTimeout(() => {
          setPercentage(part.startPercentage + i);
          setProgress((part.startPercentage + i) / 100);
        }, timeoutMs);
        timeouts.push(timeout);
      }

      // set up text transition animation at the end of each part (except the last one)
      if (part.end < 6.22) {
        const textTransitionTimeout = setTimeout(async () => {
          // play haptic feedback
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.timing(animatedValue, {
            toValue: -wp(100),
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setTextIndex((prevIndex) => {
              return prevIndex + 1;
            });
            animatedValue.setValue(wp(100));
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          });
        }, part.end * 1000);
        timeouts.push(textTransitionTimeout);
      }
    });

    // add haptic feedback at the final 6.22 mark
    const finalHapticTimeout = setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 6220);
    timeouts.push(finalHapticTimeout);

    // navigate to home or app-wall after animation completes (6.22s) plus 500ms delay
    const navigationTimeout = setTimeout(() => {
      updateUser({ hasCompletedUserSetup: true });
      if (subscriptionStatus === "ACTIVE" || isFreeTrialActive) {
        router.replace("/(tabs)/homeTab/home");
      } else {
        router.push("/app-wall");
      }
    }, 6220 + 400);
    timeouts.push(navigationTimeout);

    // cleanup function to clear all timeouts when component unmounts
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.percentage}>{percentage}%</Text>
      <Text style={styles.settingEverything}>
        {t("customPlanGeneration.settingUp.title")}
        <Text style={styles.settingEverythingHighlight}>
          {t("customPlanGeneration.settingUp.titleHighlight")}
        </Text>
      </Text>
      <View style={styles.progressTopMargin}></View>
      <ProgressBar
        progress={progress}
        color="#7C8CD8"
        width={scaleWidth(329)}
      />
      <Animated.Text
        style={{
          ...styles.processingYour,
          transform: [{ translateX: animatedValue }],
        }}
      >
        {/*texts[textIndex]*/}
        Processing your relation priorities...
      </Animated.Text>

      <View style={styles.illustrationContainer}>
                  <Progress width="100%" height="100%" />
                </View>
     {/* <LottieView
        autoPlay={true}
        loop={true}
        style={styles.animation}
        source={zodiacAnimationSource}
        renderMode="HARDWARE"
        resizeMode="cover"
      />*/}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(48),
    color: "#111111",
    textAlign: "center",
  },
  settingEverything: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(24),
    color: "#333333",
    textAlign: "center",
    marginTop: Platform.OS === "ios" ? hp(1.6) : hp(0),
    marginHorizontal: wp(8),
  },
  settingEverythingHighlight: {
    color: "#6A4CFF", // keep brand/accent color
  },
  progressTopMargin: {
    marginTop: Platform.OS === "ios" ? hp(4) : hp(3),
  },
  processingYour: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    color: "#666666",
    marginTop: Platform.OS === "ios" ? hp(4) : hp(3.5),
    textAlign: "center",
    marginHorizontal: wp(8),
  },
  animation: {
    marginTop: Platform.OS === "ios" ? hp(4) : hp(3),
    width: scaleWidth(400),
    height: scaleHeight(400),
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  illustrationContainer: {
    marginTop: Platform.OS === "ios" ? hp(4) : hp(3),
    width: scaleWidth(400),
    height: scaleHeight(400),
  },
});

export default SettingUp;
