import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  BackHandler,
  ScrollView,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { useRouter } from "expo-router";
import BackButton from "@reusable-components/buttons/backButton";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { generateKeyIngredients } from "@utilities/generate-key-ingredients";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { reachGoalsSteps } from "@blue-prints/global-store/onboarding/onboarding";
import { LinearGradient } from "expo-linear-gradient";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import useInsetsInfo from "@hooks/use-insets-info";
import tick from "@assets/images/custom-plan-generation/tick.png";
import circleOne from "@assets/images/custom-plan-generation/circle-one.png";
import circleTwo from "@assets/images/custom-plan-generation/circle-two.png";
import circleThree from "@assets/images/custom-plan-generation/circle-three.png";
import circleFour from "@assets/images/custom-plan-generation/circle-four.png";
import { useUserStore } from "@/src/global-store/user-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

const circlesArray = [circleOne, circleTwo, circleThree, circleFour];

interface GenerateSuccessProps {
  fromSettings?: boolean;
}

const GenerateSuccess: React.FC<GenerateSuccessProps> = ({
  fromSettings = false,
}) => {
  const { t } = useTranslation();
  const { skinGoal } = useOnboardingStore();
  const { subscriptionStatus, refetchSubscriptionStatus, isFreeTrialActive } =
    useUserStore();

  const { topInsets } = useInsetsInfo();

  // to add custom logic to back button press on Android
  const onBackPress = useCallback(() => {
    if (fromSettings) {
      router.back();
      return true;
    } else {
      router.dismissTo("/custom-plan-generation/all-done");
      return true;
    }
  }, [fromSettings]);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  const router = useRouter();

  const handleBackButtonPress = useCallback(() => {
    if (fromSettings) {
      router.back();
    } else {
      router.dismissTo("/custom-plan-generation/all-done");
    }
  }, [fromSettings]);

  const keyIngredients = useMemo(() => {
    return generateKeyIngredients(skinGoal);
  }, [skinGoal]);

  const handleGetStarted = useCallback(() => {
    if (subscriptionStatus === "ACTIVE" || isFreeTrialActive) {
      router.replace("/(tabs)/homeTab/home");
    } else {
      router.push("/app-wall");
    }
  }, [subscriptionStatus, isFreeTrialActive]);

  // this is to capture x coordinate of the text: 'Plan based on...' so we can align texts at same line
  const [textX, setTextX] = useState<number>(0);
  const handleLayout = (event: any) => {
    const { x } = event.nativeEvent.layout;
    setTextX(x);
  };

  useEffect(() => {
    refetchSubscriptionStatus();
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
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainer}
          >
            <Image source={tick} />
            <Text style={styles.title}>{t("customPlanGeneration.generateSuccess.title")}</Text>
            <Text style={styles.subTitle}>
              {t("customPlanGeneration.generateSuccess.subtitle")}
            </Text>
            <View style={styles.keyIngredients}>
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: scaleFont(20),
                    marginTop: Platform.OS === "ios" ? hp(2.5) : hp(1.5),
                  },
                ]}
              >
                {t("customPlanGeneration.generateSuccess.keyIngredientsTitle")}
              </Text>
              {keyIngredients.map((ingredient, index) => (
                <View
                  key={index}
                  style={[
                    styles.ingredientCard,
                    {
                      marginTop:
                        index === 0
                          ? Platform.OS === "ios"
                            ? hp(2.5)
                            : hp(1.5)
                          : hp(2),
                    },
                  ]}
                >
                  <View style={styles.circleContainer}>
                    <Image source={circlesArray[index % circlesArray.length]} />
                  </View>
                  <View style={styles.ingredientContainer}>
                    <Text style={styles.ingredientCount}>
                      {t("customPlanGeneration.generateSuccess.ingredient")} {index + 1}
                    </Text>
                    <Text style={styles.ingredientName}>{ingredient}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.analyzesYour}>
                {t("customPlanGeneration.generateSuccess.analyzesRoutine")}
              </Text>
            </View>
            <Text
              style={[
                styles.title,
                {
                  fontSize: scaleFont(20),
                  marginTop: Platform.OS === "ios" ? hp(2.6) : hp(1.9),
                },
              ]}
            >
              {t("customPlanGeneration.generateSuccess.howToReachGoals")}
            </Text>
            <LinearGradient
              colors={["#D8E6D9", "#F5FAF6"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.howToReachYourGoals}
            >
              {reachGoalsSteps.map((_step, index) => (
                <View
                  key={index}
                  style={[
                    styles.goalStepCard,
                    index > 0 && { marginTop: hp(1.3) },
                  ]}
                >
                  <Text style={styles.goalStepDescription}>{t(`onboarding.reachGoalsSteps.step${index + 1}`)}</Text>
                </View>
              ))}
            </LinearGradient>
            <Text onLayout={handleLayout} style={styles.planBasedOn}>
              {t("customPlanGeneration.generateSuccess.planBasedOn")}
            </Text>
            <Text
              style={[
                styles.planBasedOn,
                {
                  color: "#6B6B6B",
                  marginTop: Platform.OS === "ios" ? hp(2.2) : hp(1),
                  textDecorationLine: "underline",
                  alignSelf: "flex-start",
                  marginLeft: textX,
                },
              ]}
            >
              {t("customPlanGeneration.generateSuccess.sources.skinBarrier")}
            </Text>
            <Text
              style={[
                styles.planBasedOn,
                {
                  color: "#6B6B6B",
                  marginTop: Platform.OS === "ios" ? hp(1) : hp(0),
                  textDecorationLine: "underline",
                  alignSelf: "flex-start",
                  marginLeft: textX,
                },
              ]}
            >
              {t("customPlanGeneration.generateSuccess.sources.ingredientAnalysis")}
            </Text>
            <Text
              style={[
                styles.planBasedOn,
                {
                  color: "#6B6B6B",
                  marginTop: Platform.OS === "ios" ? hp(1) : hp(0),
                  marginBottom: hp(2),
                  textDecorationLine: "underline",
                  alignSelf: "flex-start",
                  marginLeft: textX,
                },
              ]}
            >
              {t("customPlanGeneration.generateSuccess.sources.investigativeDermatology")}
            </Text>
          </ScrollView>
        </View>
        {!fromSettings && (
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.buttonContainer}>
              <ButtonWithFeedback
                text={t("customPlanGeneration.generateSuccess.getStarted")}
                marginTop={hp(1.5)}
                backgroundColor={"#698D5F"}
                textColor={"#FFFFFF"}
                viewStyle={{
                  alignSelf: "center",
                }}
                onPress={handleGetStarted}
              />
            </View>
          </SafeAreaView>
        )}
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
  contentContainer: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
  },
  scrollViewContentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
    marginTop: Platform.OS === "ios" ? hp(2) : hp(1),
  },
  subTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginTop: Platform.OS === "ios" ? hp(1.5) : hp(0),
  },
  keyIngredients: {
    width: scaleWidth(350),
    paddingBottom: hp(2.2),
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginTop: hp(4.5),
    alignItems: "center",
    justifyContent: "flex-start",
  },
  ingredientCard: {
    width: scaleWidth(316),
    minHeight: scaleHeight(57),
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    shadowColor: "#2B3B50",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    flex: 1,
  },
  circleContainer: {
    width: scaleWidth(55),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#EAEAEA",
  },
  ingredientContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
    paddingLeft: wp(3),
  },
  ingredientCount: {
    fontFamily: "HelveticaRegular",
    fontSize: 13,
    color: "#121212",
  },
  ingredientName: {
    fontFamily: "HelveticaBold",
    fontSize: 16,
    color: "#121212",
    marginTop: Platform.OS === "ios" ? hp(0.2) : hp(-0.7),
  },
  analyzesYour: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#121212",
    textAlign: "center",
    marginTop: hp(2),
  },
  howToReachYourGoals: {
    width: scaleWidth(338),
    paddingBottom: hp(0.7),
    borderRadius: 24,
    marginTop: Platform.OS === "ios" ? hp(2) : hp(1.5),
    alignItems: "center",
  },
  goalStepCard: {
    width: scaleWidth(297),
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginTop: hp(3),
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: wp(5),
    paddingRight: wp(3),
    paddingTop: Platform.OS === "ios" ? wp(3.5) : wp(2),
    paddingBottom: Platform.OS === "ios" ? wp(3.5) : wp(2),
  },
  goalStepDescription: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(14),
    color: "#1C1C1C",
  },
  planBasedOn: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#1C1C1C",
    marginTop: hp(3.5),
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

export default GenerateSuccess;
