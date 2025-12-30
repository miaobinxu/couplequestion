import Settings from "@/src/screens/settings/Settings";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  return <Settings />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
