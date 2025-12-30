import React, { useRef, useCallback } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { useRouter } from "expo-router";
import BackButton from "@reusable-components/buttons/backButton";
import { isIphoneSE } from "@utilities/check-mobile-device";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import useInsetsInfo from "@hooks/use-insets-info";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

const AllDone: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { topInsets } = useInsetsInfo();

  const animation = useRef<LottieView>(null);

  const handleBackButtonPress = useCallback(() => {
    router.back();
  }, []);

  const handleContinue = useCallback(() => {
    router.push("/custom-plan-generation/setting-up");
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View
        style={[
          styles.header,
          {
            marginTop: Platform.OS === "ios" ? undefined : topInsets,
          },
        ]}
      >
        <BackButton onPress={handleBackButtonPress} />
      </View>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView
            autoPlay
            loop={true}
            ref={animation}
            style={styles.animation}
            source={require("@assets/lottie_animations/custom-plan-generation/all-done.json")}
          />
          <Text style={styles.subTitle}>{t("customPlanGeneration.allDone.subtitle")}</Text>
          <Text style={styles.title}>
            {t("customPlanGeneration.allDone.title")}
          </Text>
        </View>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonContainer}>
            <ButtonWithFeedback
              text={t("common.continue")}
              marginTop={hp(1.5)}
              backgroundColor={"#698D5F"}
              textColor={"#FFFFFF"}
              viewStyle={{
                alignSelf: "center",
              }}
              onPress={handleContinue}
            />
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FCFA",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  content: {
    flex: 12,
  },
  animationContainer: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  animation: {
    width: scaleWidth(100.7),
    height: scaleHeight(198.7),
    marginTop: hp(10),
  },
  subTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginTop: hp(5),
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
    marginTop: Platform.OS === "ios" ? hp(1.7) : hp(0),
    textAlign: "center",
  },
  buttonContainer: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    borderTopColor: "#ededed",
    paddingBottom: hp(2),
  },
});

export default AllDone;
