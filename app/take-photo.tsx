import React, { useCallback } from "react";
import TakePhoto from "@screens/sign-in/TakePhoto";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export type FaceScanType = {
  fromScan: "product" | "food" | "skin"; // 'fromScan' can be a string or undefined
};

const TakePhotoScreen = () => {
  const { fromScan } = useLocalSearchParams<FaceScanType>();
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

  return <TakePhoto scanType={fromScan} />;
};

export default TakePhotoScreen;
