import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import ButtonWithoutFeedback from "@reusable-components/buttons/ButtonWithoutFeedback";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import useInsetsInfo from "@hooks/use-insets-info";

import fiveStars from "@assets/images/misc/5-stars.png";
import leafLeft from "@assets/images/foyer/leaf-left.png";
import leafRight from "@assets/images/foyer/leaf-right.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

const Foyer: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { topInsets, isBottomInsetZero } = useInsetsInfo();

  const [textIndex, setTextIndex] = useState<number>(0);
  const texts: string[] = [
    t("foyer.testimonials.simpleExplanation"),
    t("foyer.testimonials.adultAcne"),
    t("foyer.testimonials.easierChoice"),
  ];
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(animatedValue, {
        toValue: -wp(100),
        duration: 450,
        useNativeDriver: true,
      }).start(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        animatedValue.setValue(wp(100));
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [animatedValue]);

  const animation = useRef<LottieView>(null);

  const navigateToOnboardingDynamicStepper = useCallback(() => {
    // router.push("/sign-in/app-wall");
    // router.push("/sign-in/app-wall-unpaid");
    // router.push("/(tabs)");
    router.push("/onboarding/onboarding-dynamic-stepper");
  }, []);

  const navigateToPayWall = useCallback(() => {
    router.push("/app-wall");
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={[styles.container]}>
      <StatusBar style="light" />
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainerStyle}
        >
          {/* <LottieView
            autoPlay
            loop={true}
            ref={animation}
            style={styles.animation}
            source={require("@assets/lottie_animations/onboarding/hands-Moving.json")}
          /> */}

          <View style={{ flex: 1, minHeight: 350 }}></View>
          <View style={styles.leafAndGlowingUsersContainer}>
            <Image source={leafLeft} />
            <View style={styles.glowingUsersContainer}>
              <Text style={styles.twoMillion}>{t("foyer.twoMillion")}</Text>
              <Text style={styles.glowingUsers}>{"Souls guided"}</Text>
            </View>
            <Image source={leafRight} />
          </View>
          <Text style={styles.createBestVersion}>
            {t("foyer.createBestVersion")}
          </Text>
          <Animated.View
            style={{
              transform: [{ translateX: animatedValue }],
            }}
          >
            <Image source={fiveStars} style={styles.fiveStars} />
          </Animated.View>
          <Animated.Text
            style={{
              ...styles.changingText,
              transform: [{ translateX: animatedValue }],
            }}
          >
            {texts[textIndex]}
          </Animated.Text>
            
        </ScrollView>
      </View>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.footer}>
          <ButtonWithFeedback
            fontFamily="HelveticaBold"
            text={t("foyer.getStarted")}
            onPress={navigateToOnboardingDynamicStepper}
          />
          {/* <ButtonWithoutFeedback
          fontSize={17}
          text="Have an account? Sign in"
          marginTop={hp(3)}
          onPress={navigateToPayWall}
        /> */}
          {/* <View
          style={{
            marginBottom: isBottomInsetZero ? hp(3) : hp(1),
          }}
        ></View> */}
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  contentContainer: {
    flex: 1,
  },
  scrollViewContentContainerStyle: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  animation: {
    width: scaleWidth(330),
    height: scaleHeight(360),
    marginTop: hp(2),
  },
  leafAndGlowingUsersContainer: {
    flexDirection: "row",
    marginTop: hp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  glowingUsersContainer: {
    alignItems: "center",
    paddingBottom: hp(1),
  },
  twoMillion: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(34),
    color: "#FFFFFF",
    marginHorizontal: wp(2),
  },
  glowingUsers: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(24),
    color: "#FFFFFF",
    lineHeight: Platform.OS === "android" ? wp(7) : undefined,
  },
  createBestVersion: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(24),
    color: "#FFFFFF",
    marginTop: hp(4),
    textAlign: "center",
  },
  fiveStars: {
    marginTop: hp(6),
  },
  changingText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#FFFFFF",
    marginTop: hp(1),
    marginHorizontal: wp(2),
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    zIndex: 1000,
    paddingBottom: hp(2),
  },
});

export default Foyer;
