import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Appearance,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { countStatuses, type CatalogRecord } from "@/lib/catalog";
import { useCollectionStore } from "@/lib/collection-store";
import { useThemeContext } from "@/lib/theme-provider";
import { useColors } from "@/hooks/use-colors";
import { BUILD_STAMP } from "@/lib/build-stamp";

const STATUS_KEY = "agilite-collection-status-v1";

type DiagnosticRowProps = { label: string; value: string };

function DiagnosticRow({ label, value }: DiagnosticRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text selectable style={styles.rowValue}>
        {value}
      </Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function safeJson(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}

export default function DebugScreen() {
  const colors = useColors();
  const { colorScheme } = useThemeContext();
  const { records, statuses, ready } = useCollectionStore();
  const [storageInfo, setStorageInfo] = useState({
    statusPresent: false,
    keyCount: 0,
    serializedBytes: 0,
    error: "none",
  });
  const [refreshedAt, setRefreshedAt] = useState(() => new Date());

  const refreshStorage = useCallback(async () => {
    try {
      const [stored, keys] = await Promise.all([
        AsyncStorage.getItem(STATUS_KEY),
        AsyncStorage.getAllKeys(),
      ]);
      setStorageInfo({
        statusPresent: stored !== null,
        keyCount: keys.length,
        serializedBytes: stored ? stored.length : 0,
        error: "none",
      });
    } catch (error) {
      setStorageInfo((current) => ({
        ...current,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
    setRefreshedAt(new Date());
  }, []);

  useEffect(() => {
    void refreshStorage();
  }, [refreshStorage, ready]);

  const counts = useMemo(
    () => countStatuses(records, statuses),
    [records, statuses],
  );
  const screen = Dimensions.get("window");
  const nativeConstants = (Platform.constants ?? {}) as unknown as Record<
    string,
    unknown
  >;
  const reactNativeVersion = nativeConstants.reactNativeVersion
    ? safeJson(nativeConstants.reactNativeVersion)
    : "unavailable";
  const config = Constants.expoConfig;
  const appUrl = Linking.createURL("/");
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "not configured";
  const apiHost = apiUrl.startsWith("http") ? new URL(apiUrl).host : apiUrl;

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>DEVELOPER TOOLS</Text>
          <Text style={styles.title}>Diagnostics</Text>
          <Text style={styles.subtitle}>
            Screenshot this page when reporting a problem. Values are read-only
            and credential values are intentionally hidden.
          </Text>
          <Pressable
            onPress={() => void refreshStorage()}
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.refreshText}>Refresh diagnostics</Text>
          </Pressable>
        </View>

        <Section title="Build identity">
          <DiagnosticRow label="App name" value={config?.name ?? "unknown"} />
          <DiagnosticRow
            label="App version"
            value={config?.version ?? "unknown"}
          />
          <DiagnosticRow
            label="Android version code"
            value={String(config?.android?.versionCode ?? "unknown")}
          />
          <DiagnosticRow label="Source commit" value={BUILD_STAMP.commit} />
          <DiagnosticRow label="Workflow run" value={BUILD_STAMP.run} />
          <DiagnosticRow label="Build timestamp" value={BUILD_STAMP.builtAt} />
          <DiagnosticRow
            label="Expo SDK"
            value={String(Constants.expoConfig?.sdkVersion ?? "unknown")}
          />
          <DiagnosticRow
            label="New Architecture"
            value={String(config?.newArchEnabled ?? "unknown")}
          />
          <DiagnosticRow
            label="Execution"
            value={String(Constants.executionEnvironment ?? "unknown")}
          />
          <DiagnosticRow
            label="App ownership"
            value={String(Constants.appOwnership ?? "unknown")}
          />
        </Section>

        <Section title="Runtime">
          <DiagnosticRow
            label="Platform"
            value={`${Platform.OS} ${Platform.Version}`}
          />
          <DiagnosticRow label="React Native" value={reactNativeVersion} />
          <DiagnosticRow
            label="Color scheme"
            value={`${colorScheme ?? "unknown"} / system ${Appearance.getColorScheme() ?? "unknown"}`}
          />
          <DiagnosticRow
            label="Window"
            value={`${Math.round(screen.width)} × ${Math.round(screen.height)} @${screen.scale}x`}
          />
          <DiagnosticRow label="Font scale" value={String(screen.fontScale)} />
          <DiagnosticRow label="Deep-link URL" value={appUrl} />
          <DiagnosticRow
            label="JS engine"
            value={String(nativeConstants.jsEngine ?? "unknown")}
          />
        </Section>

        <Section title="Collection state">
          <DiagnosticRow
            label="Catalog records"
            value={String(records.length)}
          />
          <DiagnosticRow label="Store ready" value={String(ready)} />
          <DiagnosticRow label="Owned" value={String(counts.Owned)} />
          <DiagnosticRow label="Verified" value={String(counts.Verified)} />
          <DiagnosticRow
            label="Missing Link"
            value={String(counts["Missing Link"])}
          />
          <DiagnosticRow
            label="Not Found"
            value={String(counts["Not Found"])}
          />
          <DiagnosticRow
            label="Status keys in memory"
            value={String(Object.keys(statuses).length)}
          />
          <DiagnosticRow
            label="Categories"
            value={
              Array.from(
                new Set(
                  (records as CatalogRecord[]).map((record) => record.category),
                ),
              ).join(", ") || "none"
            }
          />
        </Section>

        <Section title="Local storage">
          <DiagnosticRow
            label="Storage mode"
            value="AsyncStorage / device only"
          />
          <DiagnosticRow
            label="Status key present"
            value={String(storageInfo.statusPresent)}
          />
          <DiagnosticRow
            label="AsyncStorage key count"
            value={String(storageInfo.keyCount)}
          />
          <DiagnosticRow
            label="Status JSON bytes"
            value={String(storageInfo.serializedBytes)}
          />
          <DiagnosticRow label="Storage error" value={storageInfo.error} />
          <DiagnosticRow
            label="Last refreshed"
            value={refreshedAt.toISOString()}
          />
        </Section>

        <Section title="Configuration (safe view)">
          <DiagnosticRow label="API host" value={apiHost} />
          <DiagnosticRow
            label="Owner configured"
            value={
              process.env.EXPO_PUBLIC_OWNER_NAME ? "yes (value hidden)" : "no"
            }
          />
          <DiagnosticRow
            label="OAuth server configured"
            value={
              process.env.EXPO_PUBLIC_OAUTH_SERVER_URL
                ? "yes (URL hidden)"
                : "no"
            }
          />
          <DiagnosticRow
            label="Project ID configured"
            value={process.env.VITE_APP_ID ? "yes (value hidden)" : "no"}
          />
          <DiagnosticRow label="Secrets" value="Not displayed" />
        </Section>

        <Section title="Theme tokens">
          <DiagnosticRow label="Background" value={colors.background} />
          <DiagnosticRow label="Surface" value={colors.surface} />
          <DiagnosticRow label="Foreground" value={colors.foreground} />
          <DiagnosticRow label="Muted" value={colors.muted} />
          <DiagnosticRow label="Primary" value={colors.primary} />
          <DiagnosticRow label="Border" value={colors.border} />
          <DiagnosticRow label="Success" value={colors.success} />
          <DiagnosticRow label="Warning" value={colors.warning} />
          <DiagnosticRow label="Error" value={colors.error} />
        </Section>

        <Text style={styles.footer}>
          Diagnostics are local-only. This screen does not upload logs,
          collection data, or secrets.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 48 },
  header: { paddingBottom: 24 },
  kicker: {
    color: "#A8D46F",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.7,
    marginBottom: 7,
  },
  title: {
    color: "#F2F0E9",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  subtitle: {
    color: "#9AA2A4",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: 580,
  },
  refreshButton: {
    alignSelf: "flex-start",
    backgroundColor: "#A8D46F",
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshText: { color: "#152018", fontSize: 12, fontWeight: "800" },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: "#A8D46F",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#191D1F",
    borderRadius: 16,
    borderColor: "#303A32",
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  row: {
    borderBottomColor: "#303A32",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: 11,
  },
  rowLabel: { color: "#8E9A8B", flex: 0.9, fontSize: 12, lineHeight: 17 },
  rowValue: {
    color: "#F2F0E9",
    flex: 1.35,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "right",
  },
  footer: {
    color: "#687274",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 2,
    textAlign: "center",
  },
  pressed: { opacity: 0.65 },
});
