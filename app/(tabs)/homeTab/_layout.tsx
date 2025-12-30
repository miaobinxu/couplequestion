import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      {/* <Stack.Screen name="product-details" options={{ headerShown: false }} />
      <Stack.Screen name="food-details" options={{ headerShown: false }} />
      <Stack.Screen name="skin-details" options={{ headerShown: false }} />
      <Stack.Screen name="take-photo" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
