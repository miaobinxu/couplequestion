import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import ButtonWithoutFeedback from "@reusable-components/buttons/ButtonWithoutFeedback";
import {
  skinGoalArray,
  SkinGoal,
} from "@blue-prints/global-store/onboarding/onboarding";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import * as Haptics from "expo-haptics";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont, scaleHeight } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface SixtyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const SixtyPercentContent: React.FC<SixtyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { skinGoal, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    useEffect(() => {
      setSelectedSkinGoal(skinGoal);
    }, [skinGoal]);

    const [selectedSkinGoal, setSelectedSkinGoal] =
      useState<string[]>(skinGoal);

    const handleSkinGoalSelect = useCallback(
      async (skinGoalType: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const updated = skinGoal.some((item) => item === skinGoalType)
          ? skinGoal.filter((item) => item !== skinGoalType)
          : [...skinGoal, skinGoalType];
        updateOnboarding({ skinGoal: updated as SkinGoal });
      },
      [skinGoal]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.7);
    }, []);

    const animatedValues = useRef(
      Array.from({ length: skinGoalArray.length }, () => new Animated.Value(0))
    ).current;

    useEffect(() => {
      animatedValues.forEach((animatedValue) => {
        Animated.spring(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
          delay: 100,
        }).start();
      });
    }, []);

    const getSkinGoalTranslation = (goal: string) => {
      const keyMap: Record<string, string> = {
        "Reduce acne or post-acne": "reduceAcne",
        "Minimize wrinkles, improve skin firmness": "minimizeWrinkles",
        "Minimize pores": "minimizePores",
        "Get rid of pigmentation": "ridPigmentation",
        "Make skin more hydrated": "moreHydrated",
        "Reduce redness and irritation": "reduceRedness",
      };
      const key = keyMap[goal] || "reduceAcne";
      return t(`onboarding.skinGoals.${key}`);
    };

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{t("onboarding.skinGoal.title")}</Text>
            <Text style={styles.subTitle}>
              {t("onboarding.skinGoal.subtitle")}
            </Text>
            {skinGoalArray.map((skinGoalType, index) => (
              <Animated.View
                key={skinGoalType}
                style={{
                  opacity: animatedValues[index],
                  alignSelf: "center",
                  transform: [
                    {
                      scale: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                }}
              >
                <ButtonWithoutFeedback
                  text={getSkinGoalTranslation(skinGoalType)}
                  onPress={() => handleSkinGoalSelect(skinGoalType)}
                  marginTop={index === 0 ? hp(6) : hp(1.7)}
                  fontFamily="CormorantGaramondBold"
                  backgroundColor={
                    selectedSkinGoal.includes(skinGoalType)
                      ? "#7C8CD8"
                      : "#ffffff"
                  }
                  textColor={
                    selectedSkinGoal.includes(skinGoalType)
                      ? "#FFFFFF"
                      : "#000000"
                  }
                  viewStyle={{
                    alignSelf: "center",
                    borderRadius: 12,
                    height: scaleHeight(69),
                    shadowColor: "rgba(18, 55, 105, 0.06)",
                    shadowOffset: {
                      width: 1,
                      height: 3,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                />
              </Animated.View>
            ))}
            <View style={{ marginTop: hp(2) }}></View>
          </ScrollView>
        </View>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={
                continueLabel === "Continue"
                  ? t("onboarding.continue")
                  : continueLabel
              }
              marginTop={hp(1.5)}
              backgroundColor={
                selectedSkinGoal.length > 0 ? "#698D5F" : "#edefef"
              }
              textColor={selectedSkinGoal.length > 0 ? "#FFFFFF" : "#b8b9bb"}
              viewStyle={{
                alignSelf: "center",
              }}
              disabled={selectedSkinGoal.length === 0}
              onPress={handleContinue}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
);

const styles = StyleSheet.create({
  contentPart: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
  },
  subTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginLeft: wp(5.5),
    marginTop: Platform.OS === "ios" ? hp(2) : hp(0.7),
    marginRight: wp(2),
  },
  buttonPart: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    borderTopColor: "#ededed",
    paddingBottom: hp(2),
  },
});

export default SixtyPercentContent;
