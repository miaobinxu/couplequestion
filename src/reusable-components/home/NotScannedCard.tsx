import React from "react";
import { scaleFont } from "@/src/utilities/responsive-design";
import { Platform, Text, View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "@/src/hooks/use-translation";

interface NotScannedCardProps {
  title?: string;
  description?: string;
}

export default function NotScannedCard({
  title,
  description,
}: NotScannedCardProps) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || t("home.notScannedTitle")}</Text>
      <Text style={styles.description}>{description || t("home.notScannedDescription")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    shadowColor: "#EAEAEA",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: hp(1.8),
    padding: wp(3),
    alignItems: "center",
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    fontWeight: "bold",
    color: "#1C1C1C",
  },
  description: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    textAlign: "center",
    marginTop: hp(0.5),
    lineHeight: Platform.OS === "ios" ? wp(5.5) : wp(6.5),
    color: "#1C1C1C",
  },
});
