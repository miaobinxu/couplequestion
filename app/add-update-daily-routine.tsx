import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import AddupdateDailyRoutine from "@/src/screens/settings/AddupdateDailyRoutine";

export type RoutineType = {
  data: string;
  type: "new" | "update";
};

export default function Index() {
  const { type, data } = useLocalSearchParams<RoutineType>();
  const navigation = useNavigation();
  console.log("type", type);

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
  return <AddupdateDailyRoutine type={type} data={data} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
