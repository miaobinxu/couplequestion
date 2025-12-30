import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { scaleFont } from "@/src/utilities/responsive-design";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  children,
  containerStyle,
  titleStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1C1C1C",
  },
});

export default SectionContainer;
