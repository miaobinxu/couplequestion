import React from "react";
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from "react-native";
import { scaleFont } from "@/src/utilities/responsive-design";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type ChecklistCardProps = {
  text: string;
  completed?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
};

export default function ChecklistCard({
  text,
  completed = false,
  onToggle = () => {},
  disabled = false,
}: ChecklistCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled}
      onPress={onToggle}
      style={[
        styles.card,
        completed && styles.cardCompleted,
        disabled && styles.cardDisabled,
      ]}
    >
      <Text
        style={[
          styles.cardText,
          completed && styles.cardTextCompleted,
          disabled && styles.cardTextDisabled,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

type Style = {
  card: ViewStyle;
  cardCompleted: ViewStyle;
  cardText: TextStyle;
  cardTextCompleted: TextStyle;
};

const styles = StyleSheet.create({
  card: {
    padding: wp(4),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: hp(1.5),
  },
  cardCompleted: {
    backgroundColor: "#E0FBE2",
    borderColor: "#B4E5B8",
  },
  cardDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#DCDCDC",
  },
  cardText: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(17),
    color: "#1C1C1C",
    ...Platform.select({
      android: {
        lineHeight: 24,
      },
    }),
  },
  cardTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6C6C6C",
  },
  cardTextDisabled: {
    color: "#A0A0A0",
  },
});
