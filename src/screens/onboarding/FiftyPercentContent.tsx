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
  skinConcernArray,
  SkinConcern,
} from "@blue-prints/global-store/onboarding/onboarding";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import * as Haptics from "expo-haptics";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont, scaleHeight } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface FiftyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const FiftyPercentContent: React.FC<FiftyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { skinConcern, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    useEffect(() => {
      setSelectedSkinConcern(skinConcern);
    }, [skinConcern]);

    const [selectedSkinConcern, setSelectedSkinConcern] =
      useState<string[]>(skinConcern);

    const handleSkinConcernSelect = useCallback(
      async (skinConcernType: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const updated = skinConcern.some((item) => item === skinConcernType)
          ? skinConcern.filter((item) => item !== skinConcernType)
          : [...skinConcern, skinConcernType];
        updateOnboarding({ skinConcern: updated as SkinConcern });
      },
      [skinConcern]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.6);
    }, []);

    const animatedValues = useRef(
      Array.from(
        { length: skinConcernArray.length },
        () => new Animated.Value(0)
      )
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

    const getSkinConcernTranslation = (concern: string) => {
      const keyMap: Record<string, string> = {
        Acne: "acne",
        Wrinkles: "wrinkles",
        "Large pores": "largePores",
        Pigmentation: "pigmentation",
        "Dry skin": "drySkin",
        Redness: "redness",
      };
      const key = keyMap[concern] || "acne";
      return t(`onboarding.skinConcerns.${key}`);
    };

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              {t("onboarding.skinConcern.title")}
            </Text>
            <Text style={styles.subTitle}>
              {t("onboarding.skinConcern.subtitle")}
            </Text>
            {skinConcernArray.map((skinConcernType, index) => (
              <Animated.View
                key={skinConcernType}
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
                  text={getSkinConcernTranslation(skinConcernType)}
                  onPress={() => handleSkinConcernSelect(skinConcernType)}
                  marginTop={index === 0 ? hp(6) : hp(1.7)}
                  fontFamily="CormorantGaramondBold"
                  backgroundColor={
                    selectedSkinConcern.includes(skinConcernType)
                      ? "#7C8CD8"
                      : "#ffffff"
                  }
                  textColor={
                    selectedSkinConcern.includes(skinConcernType)
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
                selectedSkinConcern.length > 0 ? "#698D5F" : "#edefef"
              }
              textColor={selectedSkinConcern.length > 0 ? "#FFFFFF" : "#b8b9bb"}
              viewStyle={{
                alignSelf: "center",
              }}
              disabled={selectedSkinConcern.length === 0}
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

export default FiftyPercentContent;
