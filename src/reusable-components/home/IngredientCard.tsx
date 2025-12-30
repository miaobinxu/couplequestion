import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleFont, scaleHeight } from "@/src/utilities/responsive-design";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface IngredientCardProps {
  title: string;
  riskLabel: string;
  riskColor: string;
}

export default function IngredientCard({
  title,
  riskLabel,
  riskColor,
}: IngredientCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.riskContainer}>
        <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
        <Text style={styles.riskLabel}>{riskLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: hp(2),
    marginTop: hp(2),
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    fontWeight: "bold",
  },
  riskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.4),
  },
  riskDot: {
    borderRadius: scaleHeight(13),
    height: scaleHeight(13),
    width: scaleHeight(13),
    overflow: "hidden",
  },
  riskLabel: {
    marginLeft: wp(1),
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
  },
});
