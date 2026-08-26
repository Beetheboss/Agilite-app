import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { CollectionStoreProvider } from "@/lib/collection-store";
import { ThemeProvider } from "@/lib/theme-provider";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

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
