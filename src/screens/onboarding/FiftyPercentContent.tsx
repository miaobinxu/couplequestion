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

interface FiftyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const GOAL_OPTIONS = [
  { key: "communication", label: "Communication" },
  { key: "intimacy", label: "Intimacy" },
  { key: "fun_creativity", label: "Fun & Creativity" },
  { key: "mutual_growth", label: "Mutual Growth" },
  { key: "just_fun", label: "Nothing, just have fun" },
];

const FiftyPercentContent: React.FC<FiftyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { relationshipGoals = [], updateOnboarding } =
      useOnboardingStore();


    const [selectedGoals, setSelectedGoals] =
      useState<string[]>(relationshipGoals);

    const toggleGoal = useCallback(
      (key: string) => {
        setSelectedGoals((prev) => {
          const updated = prev.includes(key)
            ? prev.filter((g) => g !== key)
            : [...prev, key];

          updateOnboarding({ relationshipGoals: updated });
          return updated;
        });
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.6);
    }, [updateProgressBar]);

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              What areas of the relationship do you want to grow?
            </Text>

            <Text style={styles.subtitle}>Select all that applies</Text>

            <View style={{ marginTop: hp(5) }} />

            {GOAL_OPTIONS.map((option) => {
              const isSelected = selectedGoals.includes(option.key);

              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardActive,
                  ]}
                  onPress={() => toggleGoal(option.key)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            <View style={{ marginTop: hp(2) }} />
          </ScrollView>
        </View>

        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={continueLabel}
              marginTop={hp(1.5)}
              backgroundColor={
                selectedGoals.length > 0 ? "#6A4CFF" : "#333333"
              }
              textColor={
                selectedGoals.length > 0 ? "#FFFFFF" : "#666666"
              }
              viewStyle={{ alignSelf: "center" }}
              disabled={selectedGoals.length === 0}
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
  subtitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#AAAAAA",
    marginLeft: wp(5.5),
    marginTop: hp(1.5),
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6A4CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default FiftyPercentContent;
