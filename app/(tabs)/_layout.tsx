import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 10);
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.tint,
      tabBarInactiveTintColor: "#687274",
      tabBarButton: HapticTab,
      tabBarStyle: { paddingTop: 7, paddingBottom: bottomPadding, height: 62 + bottomPadding, backgroundColor: "#101314", borderTopColor: "#303A32", borderTopWidth: 1 },
      tabBarLabelStyle: { fontSize: 10, lineHeight: 13, fontWeight: "800", letterSpacing: 0.1 },
      tabBarItemStyle: { paddingVertical: 1 },
    }}>
      <Tabs.Screen name="index" options={{ title: "Overview", tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={23} color={color} /> }} />
      <Tabs.Screen name="catalog" options={{ title: "Catalog", tabBarIcon: ({ color }) => <MaterialIcons name="view-list" size={23} color={color} /> }} />
      <Tabs.Screen name="statuses" options={{ title: "Statuses", tabBarIcon: ({ color }) => <MaterialIcons name="flag" size={23} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <MaterialIcons name="tune" size={23} color={color} /> }} />
    </Tabs>
  );
}
