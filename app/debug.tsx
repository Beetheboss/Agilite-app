import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Appearance,
  AppState,
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    knownKeys: [] as string[],
    error: "none",
  });
  const [refreshedAt, setRefreshedAt] = useState(() => new Date());
  const [appState, setAppState] = useState(AppState.currentState);

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
        knownKeys: keys.filter((key) => key.startsWith("agilite")).slice(0, 20),
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

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);

  const counts = useMemo(
    () => countStatuses(records, statuses),
    [records, statuses],
  );
  const { width, height, scale, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
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
  const constantsRecord = Constants as unknown as Record<string, unknown>;
  const nativeVersion = String(constantsRecord.nativeAppVersion ?? "unknown");
  const nativeBuild = String(constantsRecord.nativeBuildVersion ?? "unknown");
  const deviceName = String(constantsRecord.deviceName ?? "unknown");
  const linkCoverage = useMemo(() => {
    const regions = ["usUrl", "israelUrl", "internationalUrl"] as const;
    return {
      any: records.filter((record) =>
        regions.some((region) => record[region].startsWith("http")),
      ).length,
      us: records.filter((record) => record.usUrl.startsWith("http")).length,
      israel: records.filter((record) => record.israelUrl.startsWith("http"))
        .length,
      international: records.filter((record) =>
        record.internationalUrl.startsWith("http"),
      ).length,
      globallyLinkless: records.filter((record) =>
        regions.every((region) => !record[region].startsWith("http")),
      ).length,
    };
  }, [records]);
  const diagnosticReport = useMemo(
    () =>
      [
        "Agilite Tracker diagnostics",
        `App: ${config?.name ?? "unknown"} ${config?.version ?? "unknown"}`,
        `Native version/build: ${nativeVersion}/${nativeBuild}`,
        `Source commit: ${BUILD_STAMP.commit}`,
        `Workflow run: ${BUILD_STAMP.run}`,
        `Platform: ${Platform.OS} ${Platform.Version}`,
        `Device: ${deviceName}`,
        `Window: ${Math.round(width)}x${Math.round(height)} @${scale}x, font ${fontScale}x`,
        `Insets: top ${insets.top}, right ${insets.right}, bottom ${insets.bottom}, left ${insets.left}`,
        `App state/path: ${appState}/${pathname}`,
        `Catalog: ${records.length} records, ${linkCoverage.any} with a working regional link, ${linkCoverage.globallyLinkless} globally linkless`,
        `Statuses: Owned ${counts.Owned}, Verified ${counts.Verified}, Missing Link ${counts["Missing Link"]}, Not Found ${counts["Not Found"]}`,
        `Storage: ${storageInfo.keyCount} keys, status present ${storageInfo.statusPresent}, ${storageInfo.serializedBytes} JSON bytes`,
        `Refreshed: ${refreshedAt.toISOString()}`,
      ].join("\n"),
    [
      appState,
      config?.name,
      config?.version,
      counts,
      deviceName,
      fontScale,
      height,
      insets.bottom,
      insets.left,
      insets.right,
      insets.top,
      linkCoverage,
      nativeBuild,
      nativeVersion,
      pathname,
      records.length,
      refreshedAt,
      scale,
      storageInfo.keyCount,
      storageInfo.serializedBytes,
      storageInfo.statusPresent,
      width,
    ],
  );

  const shareDiagnostics = useCallback(async () => {
    await Share.share({
      message: diagnosticReport,
      title: "Agilite Tracker diagnostics",
    });
  }, [diagnosticReport]);

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
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => void refreshStorage()}
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.refreshText}>Refresh</Text>
            </Pressable>
            <Pressable
              onPress={() => void shareDiagnostics()}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryText}>Share report</Text>
            </Pressable>
          </View>
        </View>

        <Section title="Build identity">
          <DiagnosticRow label="App name" value={config?.name ?? "unknown"} />
          <DiagnosticRow
            label="Android package"
            value={config?.android?.package ?? "unknown"}
          />
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
          <DiagnosticRow label="Native app version" value={nativeVersion} />
          <DiagnosticRow label="Native build version" value={nativeBuild} />
        </Section>

        <Section title="Android device">
          <DiagnosticRow label="Device name" value={deviceName} />
          <DiagnosticRow
            label="OS / API level"
            value={`${Platform.OS} ${Platform.Version}`}
          />
          <DiagnosticRow
            label="Orientation"
            value={width > height ? "landscape" : "portrait"}
          />
          <DiagnosticRow
            label="Window pixels"
            value={`${Math.round(width)} × ${Math.round(height)}`}
          />
          <DiagnosticRow label="Pixel density" value={`${scale}x`} />
          <DiagnosticRow label="Font scale" value={`${fontScale}x`} />
          <DiagnosticRow
            label="Safe-area insets"
            value={`top ${insets.top}, right ${insets.right}, bottom ${insets.bottom}, left ${insets.left}`}
          />
          <DiagnosticRow
            label="Status-bar height"
            value={`${StatusBar.currentHeight ?? "unknown"} dp`}
          />
          <DiagnosticRow label="RTL layout" value={String(I18nManager.isRTL)} />
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
          <DiagnosticRow label="App state" value={appState} />
          <DiagnosticRow label="Current route" value={pathname} />
          <DiagnosticRow
            label="Window focus"
            value="Diagnostics screen active"
          />
          <DiagnosticRow label="Development mode" value={String(__DEV__)} />
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
          <DiagnosticRow
            label="Any working regional link"
            value={`${linkCoverage.any} / ${records.length}`}
          />
          <DiagnosticRow
            label="US working links"
            value={String(linkCoverage.us)}
          />
          <DiagnosticRow
            label="Israel working links"
            value={String(linkCoverage.israel)}
          />
          <DiagnosticRow
            label="International working links"
            value={String(linkCoverage.international)}
          />
          <DiagnosticRow
            label="Globally linkless"
            value={String(linkCoverage.globallyLinkless)}
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
          <DiagnosticRow
            label="Known app keys"
            value={storageInfo.knownKeys.join(", ") || "none"}
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

        <Section title="Diagnostics report">
          <Text selectable style={styles.reportText}>
            {diagnosticReport}
          </Text>
          <Text style={styles.reportHint}>
            Use Share report to send this safe summary. It excludes secrets and
            collection item details.
          </Text>
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
  headerActions: { flexDirection: "row", gap: 10, marginTop: 15 },
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
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshText: { color: "#152018", fontSize: 12, fontWeight: "800" },
  secondaryButton: {
    borderColor: "#536154",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryText: { color: "#C8D0C6", fontSize: 12, fontWeight: "800" },
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
  reportText: {
    color: "#DDE3D8",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    lineHeight: 16,
    paddingVertical: 12,
  },
  reportHint: {
    color: "#7F8C80",
    fontSize: 11,
    lineHeight: 16,
    paddingBottom: 12,
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
