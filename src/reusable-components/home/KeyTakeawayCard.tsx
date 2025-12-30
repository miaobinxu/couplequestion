import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleFont } from "@/src/utilities/responsive-design";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface KeyTakeawayCardProps {
  text: string;
}

const KeyTakeawayCard: React.FC<KeyTakeawayCardProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: hp(1.5),
    marginTop: hp(2),
  },
  text: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1C1C1C",
  },
});

export default KeyTakeawayCard;
