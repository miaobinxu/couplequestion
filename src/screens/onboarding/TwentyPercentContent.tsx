import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface TwentyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const GENDER_OPTIONS = [
  { key: "female", label: "Female" },
  { key: "male", label: "Male" },
  { key: "non_binary", label: "Gender queer / Non-binary" },
  { key: "other", label: "Other" },
];

const TwentyPercentContent: React.FC<TwentyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { gender, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    const [selectedGender, setSelectedGender] = useState<string | undefined>(
      gender
    );

    const handleSelect = useCallback(
      (value: string) => {
        setSelectedGender(value);
        updateOnboarding({ gender: value });
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.3);
    }, [updateProgressBar]);

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              Which gender describes you best?
            </Text>

            <View style={{ marginTop: hp(6) }} />

            {GENDER_OPTIONS.map((option) => {
              const isSelected = selectedGender === option.key;

              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardActive,
                  ]}
                  onPress={() => handleSelect(option.key)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  <Text style={styles.optionText}>{option.label}</Text>
                </Pressable>
              );
            })}

            <View style={{ marginTop: hp(2) }} />
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
              backgroundColor={selectedGender ? "#6A4CFF" : "#333333"}
              textColor={selectedGender ? "#FFFFFF" : "#666666"}
              viewStyle={{ alignSelf: "center" }}
              disabled={!selectedGender}
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
    backgroundColor: "#000000",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
    marginRight: wp(6),
    lineHeight: scaleFont(36),
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(5.5),
    marginBottom: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: 14,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  optionCardActive: {
    borderColor: "#6A4CFF",
    backgroundColor: "#141414",
  },
  optionText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    marginLeft: wp(4),
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#6A4CFF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6A4CFF",
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default TwentyPercentContent;
