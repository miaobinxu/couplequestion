import { scaleFont } from "@/src/utilities/responsive-design";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";

interface DottedCircleProps {
  text: string;
  date: string;
  selected?: boolean;
  disabled?: boolean;
}

const DOTTED_SIZE = 30;

const DottedCircle: React.FC<DottedCircleProps> = ({
  text,
  date,
  selected = false,
  disabled = false,
}) => {
  const circleStyle: ViewStyle = {
    width: DOTTED_SIZE,
    height: DOTTED_SIZE,
    borderRadius: DOTTED_SIZE / 2,
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: selected ? "#000" : "rgba(0, 0, 0, 0.25)",
  };

  const textStyle: TextStyle = {
    color: selected ? "#000" : "rgba(0, 0, 0, 0.25)",
  };

  const dateStyle: TextStyle = {
    marginTop: 4,
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: selected ? "#000" : "rgba(0, 0, 0, 0.25)",
  };

  return (
    <View disabled={disabled} style={styles.container}>
      <View style={[styles.circle, circleStyle]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
      <Text style={dateStyle}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "flex-start",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#1C1C1C",
  },
});

export default DottedCircle;
