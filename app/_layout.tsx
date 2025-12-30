import React, { useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import useLoadFonts from "@hooks/use-load-fonts";
import { Stack } from "expo-router";
import { fetchOverTheAirUpdates } from "@utilities/fetch-over-the-air-updates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useUserStore } from "@/src/global-store/user-store";
import useChecklistStore from "@/src/global-store/useChecklist-store";
// Initialize i18n
import "@/src/localization/i18n";

SplashScreen.preventAutoHideAsync();

interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}
interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: { allowFontScaling?: boolean };
}
(Text as unknown as TextWithDefaultProps).defaultProps =
  (Text as unknown as TextWithDefaultProps).defaultProps || {};
(Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling =
  false;
(TextInput as unknown as TextInputWithDefaultProps).defaultProps =
  (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
(
  TextInput as unknown as TextInputWithDefaultProps
).defaultProps!.allowFontScaling = false;

const RootLayout = () => {
  const { refetchSubscriptionStatus } = useUserStore();

  const { initializeChecklist } = useChecklistStore();

  useEffect(() => {
    initializeChecklist();
  }, []);

  const fontsLoaded = useLoadFonts();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      fetchOverTheAirUpdates();
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    refetchSubscriptionStatus;
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Stack>
          {/* initial/splash screen */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* splash screen */}
          <Stack.Screen name="splash/splash" options={{ headerShown: false }} />
          {/* landing/foyer screen */}
          <Stack.Screen name="foyer/foyer" options={{ headerShown: false }} />
          {/* onboarding screen */}
          <Stack.Screen
            name="onboarding/onboarding-dynamic-stepper"
            options={{ headerShown: false }}
          />
          {/* custom plan generation screens */}
          <Stack.Screen
            name="custom-plan-generation/all-done"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="custom-plan-generation/setting-up"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="custom-plan-generation/generate-success"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          {/* sign-in screens */}
          <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="sign-in/ready-first-face-scan"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="sign-in/take-photo"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen
            name="sign-in/app-wall-unpaid"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="app-wall/index"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="app-wall/one-time-offer"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="webview/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="product-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="food-details" options={{ headerShown: false }} />
          <Stack.Screen name="skin-details" options={{ headerShown: false }} />
          <Stack.Screen name="take-photo" options={{ headerShown: false }} />
          <Stack.Screen name="skin-profile" options={{ headerShown: false }} />
          <Stack.Screen name="my-profile" options={{ headerShown: false }} />
          <Stack.Screen
            name="daily-routines"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="add-update-daily-routine"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="scan-history" options={{ headerShown: false }} />
          <Stack.Screen name="skin-report" options={{ headerShown: false }} />
          <Stack.Screen
            name="spiritual-cleanse"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="daily-horoscope"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="romantic-advice"
            options={{ headerShown: false }}
          />
        </Stack>
      </View>
      <Toast />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootLayout;
