import { Platform, Text } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeOutline from "@assets/svg/tab/home-outline.svg";
import HomeFilled from "@assets/svg/tab/home-filled.svg";
import SettingsOutline from "@assets/svg/tab/settings-outline.svg";
import SettingsFilled from "@assets/svg/tab/settings-filled.svg";
import { useTranslation } from "@/src/hooks/use-translation";
import { scaleFont } from "@/src/utilities/responsive-design";
import hapticFeedback from "@/src/utilities/hapticUtil";

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const tabItems = [
    {
      name: "homeTab",
      title: t("tabs.home"),
      icons: {
        focused: HomeFilled,
        unfocused: HomeOutline,
      },
    },
    {
      name: "settings",
      title: t("tabs.settings"),
      icons: {
        focused: SettingsFilled,
        unfocused: SettingsOutline,
      },
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 90 : Math.max(70, 50 + insets.bottom),
          paddingBottom:
            Platform.OS === "ios" ? 25 : Math.max(25, insets.bottom + 5),
          paddingTop: 10,
          paddingHorizontal: 60,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#666666",
        tabBarShowLabel: false,
      }}
      backBehavior="none"
    >
      {tabItems.map(({ name, icons }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused, color }) => {
              const Icon = focused ? icons.focused : icons.unfocused;
              return <Icon color={color} width={20} height={20} />;
            },
          }}
          listeners={{
            tabPress: () => {
              hapticFeedback.light();
            },
          }}
        />
      ))}
    </Tabs>
  );
}
