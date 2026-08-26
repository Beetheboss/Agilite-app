import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { COLLECTION_STATUSES, statusColors } from "@/lib/catalog";
import { useCollectionStore } from "@/lib/collection-store";

export default function SettingsScreen() {
  const { records, reset } = useCollectionStore();
  const buildVersion = Constants.expoConfig?.version ?? "unknown";
  const confirmReset = () => Alert.alert("Reset catalog?", "This removes your local status changes and restores the imported starting catalog.", [{ text: "Cancel", style: "cancel" }, { text: "Reset", style: "destructive", onPress: () => void reset() }]);
  return (
    <ScreenContainer className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>LOCAL STORAGE</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Simple controls for your private collection log.  •  Build {buildVersion}</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}><View style={styles.iconBox}><MaterialIcons name="inventory-2" size={19} color="#A8D46F" /></View><View style={styles.cardHeaderText}><Text style={styles.cardTitle}>Imported catalog</Text><Text style={styles.cardCaption}>Agilite collectible merchandise</Text></View></View>
          <View style={styles.detail}><Text style={styles.detailLabel}>Records</Text><Text style={styles.detailValue}>{records.length}</Text></View>
          <View style={styles.detail}><Text style={styles.detailLabel}>Storage</Text><Text style={styles.detailValue}>This device only</Text></View>
          <View style={[styles.detail, styles.lastDetail]}><Text style={styles.detailLabel}>Sync</Text><Text style={styles.detailValue}>Off</Text></View>
        </View>
        <Text style={styles.sectionTitle}>Status legend</Text>
        <View style={styles.card}>{COLLECTION_STATUSES.map((status, index) => <View key={status} style={[styles.legendRow, index === COLLECTION_STATUSES.length - 1 && styles.lastDetail]}><View style={[styles.legendDot, { backgroundColor: statusColors[status].tint }]} /><Text style={styles.legendName}>{status}</Text><Text style={styles.legendDescription}>{status === "Owned" ? "You have it" : status === "Verified" ? "Link or evidence confirmed" : status === "Missing Link" ? "Needs a public link" : "No public link found"}</Text></View>)}</View>
        <Text style={styles.sectionTitle}>Developer tools</Text>
        <Pressable onPress={() => router.push("/debug")} style={({ pressed }) => [styles.debugButton, pressed && styles.pressed]}>
          <MaterialIcons name="bug-report" size={19} color="#A8D46F" />
          <View style={styles.resetCopy}><Text style={styles.resetTitle}>Diagnostics</Text><Text style={styles.resetCaption}>Runtime and build information for troubleshooting</Text></View>
          <MaterialIcons name="chevron-right" size={19} color="#687274" />
        </Pressable>
        <Text style={styles.sectionTitle}>Data controls</Text>
        <Pressable onPress={confirmReset} style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}><MaterialIcons name="restart-alt" size={19} color="#D9827A" /><View style={styles.resetCopy}><Text style={styles.resetTitle}>Reset to imported catalog</Text><Text style={styles.resetCaption}>Clear local status changes</Text></View><MaterialIcons name="chevron-right" size={19} color="#687274" /></Pressable>
        <View style={styles.privacy}><MaterialIcons name="lock-outline" size={16} color="#A8D46F" /><Text style={styles.privacyText}>No account or cloud sync is required. Your collection state stays on this device.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 0, paddingTop: 22, paddingBottom: 44 },
  kicker: { color: "#81927B", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 7 },
  title: { color: "#F2F0E9", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.9 },
  subtitle: { color: "#9AA2A4", fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: "#191D1F", borderRadius: 18, borderWidth: 1, borderColor: "#303A32", paddingHorizontal: 14, marginBottom: 26 },
  cardHeader: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  iconBox: { width: 36, height: 36, borderRadius: 11, backgroundColor: "#28352A", alignItems: "center", justifyContent: "center" },
  cardHeaderText: { flex: 1, marginLeft: 10 },
  cardTitle: { color: "#F2F0E9", fontWeight: "800", fontSize: 15 },
  cardCaption: { color: "#8E9A8B", fontSize: 11, marginTop: 3 },
  detail: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#2A302F", paddingVertical: 12 },
  lastDetail: { borderBottomWidth: 0 },
  detailLabel: { color: "#8E9A8B", fontSize: 12 },
  detailValue: { color: "#E0E2DC", fontSize: 12, fontWeight: "700" },
  sectionTitle: { color: "#F2F0E9", fontSize: 19, lineHeight: 24, fontWeight: "800", marginBottom: 12 },
  legendRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#2A302F", paddingVertical: 13 },
  legendDot: { width: 9, height: 9, borderRadius: 9 },
  legendName: { color: "#E0E2DC", fontSize: 13, fontWeight: "700", width: 92, marginLeft: 9 },
  legendDescription: { color: "#8E9A8B", fontSize: 11, flex: 1 },
  debugButton: { backgroundColor: "#191D1F", borderRadius: 18, minHeight: 66, borderWidth: 1, borderColor: "#303A32", paddingHorizontal: 14, flexDirection: "row", alignItems: "center", marginBottom: 26 },
  resetButton: { backgroundColor: "#191D1F", borderRadius: 18, minHeight: 66, borderWidth: 1, borderColor: "#303A32", paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  resetCopy: { flex: 1, marginLeft: 11 },
  resetTitle: { color: "#F2F0E9", fontWeight: "800", fontSize: 13 },
  resetCaption: { color: "#8E9A8B", fontSize: 11, marginTop: 4 },
  pressed: { opacity: 0.65 },
  privacy: { flexDirection: "row", alignItems: "center", marginTop: 23 },
  privacyText: { color: "#8E9A8B", fontSize: 11, lineHeight: 17, flex: 1, marginLeft: 9 },
});
