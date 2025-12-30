import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleFont } from "@/src/utilities/responsive-design";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

interface ScoreCardProps {
  icon: React.ReactNode;
  title: string;
  score: string;
  scoreText?: string;
  color?: string;
}

export default function ScoreCard({
  icon,
  title,
  scoreText,
  score,
  color = "#1C1C1C",
}: ScoreCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={{ ...styles.score, color }}>{score}</Text>
        {scoreText && (
          <Text style={{ ...styles.scoreText, color }}> · {scoreText}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: hp(2),
    width: (wp(100) - wp(10)) / 2 - wp(2.5),
    alignItems: "center",
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#1C1C1C",
    marginLeft: wp(2),
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginTop: hp(1),
  },
  score: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#233E1B",
    lineHeight: 24,
  },
  scoreText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#233E1B",
  },
  headerContainer: { flexDirection: "row", alignItems: "center" },
});
