import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      {/* <Stack.Screen name="skin-profile" options={{ headerShown: false }} />
      <Stack.Screen name="daily-routines" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-update-daily-routine"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="scan-history" options={{ headerShown: false }} />
      <Stack.Screen name="product-details" options={{ headerShown: false }} />
      <Stack.Screen name="food-details" options={{ headerShown: false }} />
      <Stack.Screen name="skin-details" options={{ headerShown: false }} />
      <Stack.Screen name="skin-report" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
