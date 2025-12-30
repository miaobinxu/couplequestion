import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scaleWidth, scaleHeight } from "@utilities/responsive-design";

interface ProgressBarProps {
  progress: number;
  width?: number;
  height?: number;
  color?: string;
  unfilledColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  useNativeDriver?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({
    progress,
    width = scaleWidth(302),
    height = scaleHeight(4),
    color = "#698D5F",
    unfilledColor = "#333333",
    borderRadius = 100,
    borderWidth = 0,
    useNativeDriver = true,
  }) => {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: unfilledColor,
          borderRadius,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#6A4CFF", "#FF89D6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: width * progress,
            height: "100%",
            borderRadius,
          }}
        />
      </View>
    );
  }
);

export default ProgressBar;
