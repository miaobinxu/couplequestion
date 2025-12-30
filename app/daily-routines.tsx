import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import DailyRoutines from "@/src/screens/settings/DailyRoutines";

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
  return <DailyRoutines />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
