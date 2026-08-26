import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { CollectionStoreProvider } from "@/lib/collection-store";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CollectionStoreProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle: { backgroundColor: "#121416" } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="item/[id]" />
          <Stack.Screen name="debug" />
        </Stack>
      </CollectionStoreProvider>
    </ThemeProvider>
  );
}
