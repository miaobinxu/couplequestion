import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useNavigation } from "@react-navigation/native";
import EditIcon from "@assets/svg/settings/edit-icon.svg";
import SkinReportIcon from "@assets/svg/settings/skin-report-icon.svg";
import RightArrowIcon from "@assets/svg/settings/arrow-right-white.svg";
import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";
import { useOnboardingStore } from "@/src/global-store/onboarding-store";
import { useRouter } from "expo-router";
import TenPercentContent from "../onboarding/TenPercentContent";
import TwentyPercentContent from "../onboarding/TwentyPercentContent";
import FourtyPercentContent from "../onboarding/FourtyPercentContent";
import FiftyPercentContent from "../onboarding/FiftyPercentContent";
import SixtyPercentContent from "../onboarding/SixtyPercentContent";
import { useTranslation } from "@/src/hooks/use-translation";

const SkinProfile: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const { t } = useTranslation();

  // Fetch onboarding data from the global store
  const { gender, ageGroup, skinType, skinConcern, skinGoal } =
    useOnboardingStore();

  // Translation helper functions
  const getGenderTranslation = (value: string) => {
    const keyMap: Record<string, string> = {
      Male: "male",
      Female: "female",
      Other: "other",
    };
    const key = keyMap[value];
    return key ? t(`onboarding.genderOptions.${key}`) : value;
  };

  const getAgeGroupTranslation = (value: string) => {
    const keyMap: Record<string, string> = {
      "Under 21": "under21",
      "21 to 30": "21to30",
      "31 to 40": "31to40",
      "41 to 50": "41to50",
      "51 to 60": "51to60",
      "61 or above": "61orAbove",
    };
    const key = keyMap[value];
    return key ? t(`onboarding.ageGroups.${key}`) : value;
  };

  const getSkinTypeTranslation = (value: string) => {
    const keyMap: Record<string, string> = {
      Normal: "normal",
      Dry: "dry",
      Oily: "oily",
      Combination: "combination",
      "I'm not sure": "notSure",
    };
    const key = keyMap[value];
    return key ? t(`onboarding.skinTypes.${key}.label`) : value;
  };

  const getSkinConcernTranslation = (value: string) => {
    const keyMap: Record<string, string> = {
      Acne: "acne",
      Wrinkles: "wrinkles",
      "Large pores": "largePores",
      Pigmentation: "pigmentation",
      "Dry skin": "drySkin",
      Redness: "redness",
    };
    const key = keyMap[value];
    return key ? t(`onboarding.skinConcerns.${key}`) : value;
  };

  const getSkinGoalTranslation = (value: string) => {
    const keyMap: Record<string, string> = {
      "Reduce acne or post-acne": "reduceAcne",
      "Minimize wrinkles, improve skin firmness": "minimizeWrinkles",
      "Minimize pores": "minimizePores",
      "Get rid of pigmentation": "ridPigmentation",
      "Make skin more hydrated": "moreHydrated",
      "Reduce redness and irritation": "reduceRedness",
    };
    const key = keyMap[value];
    return key ? t(`onboarding.skinGoals.${key}`) : value;
  };

  // Dynamically generate skin profile fields
  const skinProfileFields = [
    {
      label: t("skinProfile.gender"),
      value: gender ? getGenderTranslation(gender) : "N/A",
      key: "gender",
      step: 0.1,
    },
    {
      label: t("skinProfile.ageGroup"),
      value: ageGroup ? getAgeGroupTranslation(ageGroup) : "N/A",
      key: "ageGroup",
      step: 0.2,
    },
    {
      label: t("skinProfile.skinType"),
      value: skinType ? getSkinTypeTranslation(skinType) : "N/A",
      key: "skinType",
      step: 0.4,
    },
    {
      label: t("skinProfile.skinConcern"),
      value:
        skinConcern.length > 0
          ? skinConcern.map(getSkinConcernTranslation).join(", ")
          : "N/A",
      key: "skinConcern",
      step: 0.5,
    },
    {
      label: t("skinProfile.skinGoal"),
      value:
        skinGoal.length > 0
          ? skinGoal.map(getSkinGoalTranslation).join(", ")
          : "N/A",
      key: "skinGoal",
      step: 0.6,
    },
  ];

  const handleEdit = (step: number) => {
    setProgress(step);
  };

  const handleSkinReport = () => {
    // Navigate to the current skin report screen
    console.log("Navigate to skin report");
    router.push("./skin-report");
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleStartQuiz = () => {
    setQuizProgress(0.1);
  };

  let steps = [0.1, 0.2, 0.4, 0.5, 0.6];
  const [index, setIndex] = useState(0);

  const updateProgressBar = () => {
    if (quizProgress > 0) {
      if (index < steps.length - 1) {
        const nextStep = steps[index + 1]; // Get the next step based on the current index
        setQuizProgress(nextStep); // Update quizProgress
        setIndex(index + 1);
      } else {
        setQuizProgress(0); // Reset if it reaches the final step
        setIndex(0);
      }
    } else {
      setProgress(0);
    }
  };

  const handleQueBackPress = () => {
    setProgress(0);
    setQuizProgress(0);
  };

  console.log({ progress, quizProgress, index });

  return (
    <>
      {progress === 0 && quizProgress === 0 ? (
        <View style={styles.gradient}>
          <SafeAreaView edges={["top"]} style={styles.container}>
            <PageHeader
              showLogo={false}
              title={t("skinProfile.title")}
              onBackPress={handleBackPress}
              showLeftIcon={true}
              showRightIcon={false}
            />
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContentContainerStyle}
            >
              <View style={styles.card}>
                {skinProfileFields.map(({ label, value, key, step }, index) => {
                  const isLastItem = index === skinProfileFields.length - 1;
                  return (
                    <View
                      key={key}
                      style={[
                        styles.row,
                        isLastItem && { borderBottomWidth: 0 },
                      ]}
                    >
                      <Text style={styles.label}>{label}</Text>
                      <View style={styles.valueRow}>
                        <Text numberOfLines={1} style={styles.valueText}>
                          {value}
                        </Text>
                        <TouchableOpacity onPress={() => handleEdit(step)}>
                          <EditIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.reportButton}
                onPress={handleSkinReport}
              >
                <View style={styles.reportContent}>
                  <SkinReportIcon />
                  <Text style={styles.reportText}>
                    {t("skinProfile.currentSkinReport")}
                  </Text>
                </View>
                <RightArrowIcon />
              </TouchableOpacity>
            </ScrollView>
            <SafeAreaView edges={["bottom"]} style={styles.footer}>
              <ButtonWithFeedback
                text={t("skinProfile.startQuiz")}
                onPress={handleStartQuiz}
              />
            </SafeAreaView>
          </SafeAreaView>
        </View>
      ) : (
        <SafeAreaView edges={["top"]} style={styles.container}>
          <PageHeader
            showLogo={false}
            onBackPress={handleQueBackPress}
            showLeftIcon={true}
            showRightIcon={false}
          />
          {(progress == 0.1 || quizProgress == 0.1) && (
            <TenPercentContent
              continueLabel={
                progress > 0 ? t("common.save") : t("common.continue")
              }
              updateProgressBar={updateProgressBar}
            />
          )}
          {(progress == 0.2 || quizProgress == 0.2) && (
            <TwentyPercentContent
              continueLabel={
                progress > 0 ? t("common.save") : t("common.continue")
              }
              updateProgressBar={updateProgressBar}
            />
          )}

          {(progress == 0.4 || quizProgress == 0.4) && (
            <FourtyPercentContent
              continueLabel={
                progress > 0 ? t("common.save") : t("common.continue")
              }
              updateProgressBar={updateProgressBar}
            />
          )}
          {(progress == 0.5 || quizProgress == 0.5) && (
            <FiftyPercentContent
              continueLabel={
                progress > 0 ? t("common.save") : t("common.continue")
              }
              updateProgressBar={updateProgressBar}
            />
          )}
          {(progress == 0.6 || quizProgress == 0.6) && (
            <SixtyPercentContent
              continueLabel={t("common.save")}
              updateProgressBar={updateProgressBar}
            />
          )}
        </SafeAreaView>
      )}
    </>
  );
};

export default SkinProfile;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainerStyle: {
    marginHorizontal: wp(5),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 1,
    paddingHorizontal: wp(4),
    marginTop: hp(2),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.4),
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  label: {
    fontSize: scaleFont(17),
    color: "#1C1C1C",
    fontFamily: "HelveticaRegular",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 1,
  },
  valueText: {
    fontSize: scaleFont(17),
    color: "#1C1C1C",
    fontFamily: "HelveticaBold",
    marginRight: wp(2),
    marginLeft: wp(10),
    flexShrink: 1,
  },
  reportButton: {
    marginTop: hp(3),
    backgroundColor: "#7C8CD8",
    borderRadius: 10,
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reportContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportText: {
    color: "#fff",
    fontSize: scaleFont(17),
    fontFamily: "HelveticaBold",
    marginLeft: wp(2),
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    zIndex: 1000,
    paddingBottom: hp(2),
  },
});
