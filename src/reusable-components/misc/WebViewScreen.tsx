import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import PageHeader from "./PageHeader";

const WebViewScreen = () => {
  const router = useRouter();
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        onBackPress={handleBackPress}
        showRightIcon={false}
        title={title}
      />

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
      />
    </SafeAreaView>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  webview: {
    marginTop: 10,
    flex: 1,
  },
});
