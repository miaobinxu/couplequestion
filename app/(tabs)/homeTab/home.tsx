import React from "react";
import Home from "@/src/screens/home/Home";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { data, scanType } = useLocalSearchParams();
  return (
    <Home
      data={(data as String[]) || undefined}
      scanType={scanType as "product" | "food" | "skin" | undefined}
    />
  );
}
