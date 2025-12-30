import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

type BlurredProps = {
  intensity?: number;
  tint?: "light" | "dark";
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Blurred = ({
  intensity = 12,
  tint = "light",
  children,
  style,
}: BlurredProps) => {
  return (
    <View style={[styles.wrapper, style]}>
      <BlurView
        tint={tint}
        intensity={intensity}
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod="dimezisBlurView"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    borderRadius: 25,
    position: "relative",
  },
  content: {
    padding: 3,
  },
});
