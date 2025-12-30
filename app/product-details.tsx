import React, { useCallback } from "react";
import ProductDetails from "@/src/screens/home/ProductDetails";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

export type IndexType = {
  data: string; // 'fromScan' can be a string or undefined
};

const Index = () => {
  const { data } = useLocalSearchParams<IndexType>();
  const productData = JSON.parse(data);
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
  return <ProductDetails data={productData} />;
};

export default Index;
