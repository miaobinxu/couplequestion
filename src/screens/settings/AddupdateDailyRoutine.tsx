import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useNavigation } from "@react-navigation/native";
import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";
import useChecklistStore from "@/src/global-store/useChecklist-store";
import moment from "moment";
import { useTranslation } from "@/src/hooks/use-translation";

interface AddUpdateDailyRoutineProps {
  type: "new" | "update";
  data: string;
}

const AddUpdateDailyRoutine: React.FC<AddUpdateDailyRoutineProps> = ({
  type,
  data,
}) => {
  const parsedData = data ? JSON.parse(data) : null;
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Helper function to translate stored checklist items to current language
  const translateChecklistItem = (title: string): string => {
    const translationMap: Record<string, string> = {
      "Use a gentle cleanser twice a day": t("onboarding.reachGoalsSteps.step1"),
      "Apply a hydrating toner or essence after cleansing": t("onboarding.reachGoalsSteps.step2"),
      "Limit sugar, greasy foods, and dairy": t("onboarding.reachGoalsSteps.step3"),
      "Avoid touching your face, using harsh scrubs, or picking at your skin": t("onboarding.reachGoalsSteps.step4"),
      "Wear sunscreen when out in the sun": t("onboarding.reachGoalsSteps.step5"),
    };
    // Return translated text if found, otherwise return original title (for custom user habits)
    return translationMap[title] || title;
  };

  // Helper function to reverse translate from display text to storage key
  const reverseTranslateChecklistItem = (displayText: string): string => {
    const reverseMap: Record<string, string> = {
      [t("onboarding.reachGoalsSteps.step1")]: "Use a gentle cleanser twice a day",
      [t("onboarding.reachGoalsSteps.step2")]: "Apply a hydrating toner or essence after cleansing",
      [t("onboarding.reachGoalsSteps.step3")]: "Limit sugar, greasy foods, and dairy",
      [t("onboarding.reachGoalsSteps.step4")]: "Avoid touching your face, using harsh scrubs, or picking at your skin",
      [t("onboarding.reachGoalsSteps.step5")]: "Wear sunscreen when out in the sun",
    };
    // Return English key if found, otherwise return the display text as-is (for custom user habits)
    return reverseMap[displayText] || displayText;
  };

  // Initialize with translated text for display
  const [routineInput, setRoutineInput] = useState<string>(
    type === "update" && parsedData ? translateChecklistItem(parsedData.title) : ""
  );

  const {
    checklist,
    addToDefaultChecklistTemplate,
    updateDefaultChecklistTemplate,
    defaultChecklistTemplate,
  } = useChecklistStore(); // Access Zustand actions

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // Filter the checklist items based on the selected date
  const selectedDateChecklist = checklist[selectedDate] || [];

  // Update routine on load for the update type
  useEffect(() => {
    if (type === "update" && parsedData) {
      setRoutineInput(translateChecklistItem(parsedData.title));
    }
  }, []);

  const handleBackPress = () => navigation.goBack();

  const handleSaveRoutine = () => {
    // Convert display text back to English key for storage
    const titleToSave = reverseTranslateChecklistItem(routineInput);
    
    if (type === "new") {
      // Add to the default template checklist
      addToDefaultChecklistTemplate({
        id: `${Date.now()}`, // Generating a unique ID based on the current timestamp
        title: titleToSave,
        completed: false,
      });
    } else if (type === "update" && parsedData) {
      // Update the default template checklist
      // Update the template
      const updatedTemplate = defaultChecklistTemplate.map((item) =>
        item.id === parsedData.id ? { ...item, title: titleToSave } : item
      );

      const selectedDateUpdatedChecklist = selectedDateChecklist.map((item) =>
        item.id === parsedData.id ? { ...item, title: titleToSave } : item
      );

      // Update the store with the new template
      updateDefaultChecklistTemplate(
        updatedTemplate,
        selectedDateUpdatedChecklist
      );
    }
    navigation.goBack(); // Go back after saving
  };

  return (
    <View style={styles.gradient}>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <PageHeader
          showLogo={false}
          title={type === "new" ? t("dailyRoutine.addChecklist") : t("dailyRoutine.updateChecklist")}
          onBackPress={handleBackPress}
          showLeftIcon={true}
          showRightIcon={false}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainerStyle}
        >
          <Text style={styles.heading}>{t("dailyRoutine.heading")}</Text>
          <Text style={styles.subheading}>
            {t("dailyRoutine.subheading")}
          </Text>
          <TextInput
            style={styles.input}
            value={routineInput}
            onChangeText={(text) => setRoutineInput(text)} // Ensure state update works correctly
            placeholder={t("dailyRoutine.placeholder")}
            placeholderTextColor="#A0A0A0"
          />
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <ButtonWithFeedback
            text={type === "new" ? t("dailyRoutine.addChecklist") : t("dailyRoutine.updateChecklist")}
            onPress={handleSaveRoutine}
          />
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
};

export default AddUpdateDailyRoutine;

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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  heading: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
    marginBottom: hp(1),
  },
  subheading: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginBottom: hp(4),
  },
  input: {
    borderColor: "#7C8CD8",
    borderWidth: 1,
    marginTop: hp(9),
    padding: wp(3),
    borderRadius: 6,
    fontSize: scaleFont(16),
    fontFamily: "HelveticaRegular",
    color: "#1C1C1C",
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
