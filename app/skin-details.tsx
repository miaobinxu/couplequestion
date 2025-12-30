import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import SkinDetails from "@/src/screens/home/SkinDetails";

export type IndexType = {
  data: string; // 'fromScan' can be a string or undefined
};

const Index = () => {
  const { data } = useLocalSearchParams<IndexType>();

  const skinData = JSON.parse(data);
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
  return <SkinDetails data={skinData} />;
};

export default Index;
