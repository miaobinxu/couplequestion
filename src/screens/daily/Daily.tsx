import React, { useEffect, useMemo, useState } from "react";
import DateSlider from "@/src/reusable-components/daily/DateSlider";
import ProgressBar from "@/src/reusable-components/misc/ProgressBar";
import { scaleFont, scaleWidth } from "@/src/utilities/responsive-design";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import NextDayCountdown from "@/src/reusable-components/daily/NextDayCountdown";
import ChecklistCard from "@/src/reusable-components/daily/ChecklistCard";
import useChecklistStore, {
  getCurrentDate,
} from "@/src/global-store/useChecklist-store";
import moment from "moment";
import { useTranslation } from "@/src/hooks/use-translation";

export default function Daily() {
  const { checklist, toggleComplete, initializeChecklist } =
    useChecklistStore();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const { t } = useTranslation();

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

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  console.log({ checklist });

  // Filter the checklist items based on the selected date
  const selectedDateChecklist = checklist[selectedDate] || [];

  useEffect(() => {
    if (selectedDateChecklist?.length === 0) {
      initializeChecklist(selectedDate);
    }
  }, [selectedDateChecklist, selectedDate]);

  const completedCount = useMemo(
    () => selectedDateChecklist.filter((item) => item.completed).length,
    [selectedDateChecklist]
  );

  const progress = selectedDateChecklist.length
    ? completedCount / selectedDateChecklist.length
    : 0;

  const calculateStreak = () => {
    // Get the dates in descending order
    const dates = Object.keys(checklist).sort((a, b) =>
      moment(b).diff(moment(a))
    );
    let streak = 0;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dayChecklist = checklist[date] || [];
      const allCompleted = dayChecklist.every((item) => item.completed);

      // Check if the current day is consecutive to the previous day in the streak
      if (i === 0 || moment(dates[i - 1]).diff(moment(date), "days") === 1) {
        if (allCompleted) {
          streak++;
        } else {
          break; // Streak breaks if any day is not fully completed
        }
      } else {
        break; // Stop streak if dates are not consecutive
      }
    }

    return streak;
  };

  const streakCount = useMemo(calculateStreak, [checklist]);
  const currentDate = getCurrentDate();
  const allCompleted = completedCount === selectedDateChecklist.length;
  const isTodaySelected = currentDate === selectedDate;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t("daily.title")}</Text>
          <DateSlider
            currentDate={selectedDate}
            onChangeDate={handleDateChange}
          />
        </View>

        <View style={styles.streakContainer}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={styles.streakTextContainer}>
            <Text style={styles.streakLabel}>{t("daily.streak")}</Text>
            <Text style={styles.streakCount}>{streakCount}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{t("daily.inProgress")}</Text>
            <Text style={styles.progressCount}>
              {completedCount}/{selectedDateChecklist.length}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color="#6A4CFF"
            width={scaleWidth(360)}
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainerStyle}
        >
          {isTodaySelected && allCompleted ? (
            <NextDayCountdown />
          ) : (
            selectedDateChecklist.map((item) => (
              <ChecklistCard
                key={item.id}
                text={translateChecklistItem(item.title)}
                completed={item.completed}
                onToggle={() => toggleComplete(item.id, selectedDate)}
                disabled={!isTodaySelected}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    padding: wp(5),
    paddingVertical: wp(3),
  },
  headerText: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#FFFFFF",
  },
  streakContainer: {
    margin: wp(5),
    marginTop: 0,
    padding: wp(4),
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
  },
  streakIcon: {
    fontSize: scaleFont(30),
  },
  streakTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  streakLabel: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  streakCount: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    color: "#6A4CFF",
    fontWeight: "bold",
  },
  progressContainer: {
    marginHorizontal: wp(5),
    padding: wp(4),
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  progressLabel: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(18),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  progressCount: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(18),
    color: "#6A4CFF",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainerStyle: {
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
  },
});
