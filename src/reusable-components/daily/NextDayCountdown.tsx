import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleFont } from "@/src/utilities/responsive-design";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTranslation } from "@/src/hooks/use-translation";

const getTimeLeft = () => {
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0); // today at 24:00 = midnight
  const diff = nextMidnight.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { hours, minutes, seconds };
};

const NextDayCountdown: React.FC = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("daily.nextDayStartsIn")}</Text>
      <View style={styles.row}>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>
            {hours.toString().padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>
            {minutes.toString().padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>
            {seconds.toString().padStart(2, "0")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NextDayCountdown;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginVertical: hp(0.5),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    width: "100%",
  },
  timeBox: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: hp(1),
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(18),
    color: "#1C1C1C",
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: scaleFont(12),
    color: "#888",
    marginTop: 2,
  },
});
