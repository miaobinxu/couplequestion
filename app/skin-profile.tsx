import SkinProfile from "@/src/screens/settings/SkinProfile";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Index() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: "none" },
      });

      return () =>
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined, // Restore default when leaving
        });
    }, [navigation])
  );
  return <SkinProfile />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
