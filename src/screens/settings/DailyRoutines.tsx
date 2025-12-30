import React from "react";
import { StyleSheet, ScrollView, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useNavigation } from "@react-navigation/native";
import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import DeleteIcon from "@assets/svg/settings/delete.svg";
import ChecklistCard from "@/src/reusable-components/daily/ChecklistCard";
import { useRouter } from "expo-router";
import useChecklistStore from "@/src/global-store/useChecklist-store";
import { useTranslation } from "@/src/hooks/use-translation";

const DailyRoutines: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  // Access checklist data and actions from Zustand store
  const {
    defaultChecklistTemplate,
    deleteFromDefaultChecklistTemplate, // Use deleteFromDefaultChecklistTemplate instead of deleteTemplate
    updateItem,
    toggleComplete,
  } = useChecklistStore();

  // Helper function to translate stored checklist items
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

  const handleBackPress = () => navigation.goBack();

  const handleDelete = (id: string) => {
    deleteFromDefaultChecklistTemplate(id); // Call deleteFromDefaultChecklistTemplate action from Zustand store
  };

  const handleUpdateHabit = (id: string, title: string) => {
    router.push({
      pathname: "/add-update-daily-routine",
      params: {
        type: "update",
        data: JSON.stringify({
          id,
          title,
        }),
      },
    });
  };

  const handleAddNewHabit = () => {
    router.push({
      pathname: "/add-update-daily-routine",
      params: {
        type: "new",
      },
    });
  };

  const handleToggleComplete = (id: string) => {
    toggleComplete(id); // Toggle the completed status
  };

  const renderRightActions = (id: string) => (
    <RectButton style={styles.deleteButton} onPress={() => handleDelete(id)}>
      <DeleteIcon />
    </RectButton>
  );

  return (
    <View style={styles.gradient}>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <PageHeader
          showLogo={false}
          title={t("daily.routines.title")}
          onBackPress={handleBackPress}
          showLeftIcon={true}
          showRightIcon={false}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainerStyle}
        >
          {defaultChecklistTemplate.map((item) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => renderRightActions(item.id)}
            >
              <ChecklistCard
                key={item.id}
                text={translateChecklistItem(item.title)}
                onToggle={() => handleUpdateHabit(item.id, item.title)} // Toggle complete status
              />
            </Swipeable>
          ))}
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <ButtonWithFeedback
            text={t("daily.routines.addNewHabits")}
            onPress={handleAddNewHabit}
          />
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
};

export default DailyRoutines;

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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp(5),
    marginBottom: hp(2),
    elevation: 2,
  },
  cardTitle: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(16),
    color: "#1C1C1C",
  },
  deleteButton: {
    backgroundColor: "#EB4335",
    justifyContent: "center",
    alignItems: "center",
    width: wp(18),
    borderRadius: 12,
    marginBottom: hp(2),
  },
  deleteText: {
    color: "#fff",
    fontSize: 18,
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
