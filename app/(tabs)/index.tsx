import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { CollectionRow, MetricCard, ProgressBar, SectionLabel, StatusBadge } from "@/components/catalog-ui";
import { ScreenContainer } from "@/components/screen-container";
import { countStatuses } from "@/lib/catalog";
import { useCollectionStore } from "@/lib/collection-store";

export default function HomeScreen() {
  const { records, statuses, ready } = useCollectionStore();
  const counts = useMemo(() => countStatuses(records, statuses), [records, statuses]);
  const needsAttention = useMemo(
    () => records.filter((record) => ["Missing Link", "Not Found"].includes(statuses[record.id])).slice(0, 5),
    [records, statuses],
  );
  const completion = counts.Owned + counts.Verified;
  const percent = records.length ? Math.round((completion / records.length) * 100) : 0;

  return (
    <ScreenContainer containerClassName="bg-background" className="px-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.kicker}>PERSONAL FIELD LOG</Text>
            <Text style={styles.title}>Collection tracker</Text>
          </View>
          <View style={styles.logoMark}>
            <Image source={require("../../assets/images/header-logo.png")} style={styles.logoImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>CATALOG PROGRESS</Text>
              <Text style={styles.heroNumber}>{percent}%</Text>
            </View>
            <View style={styles.heroRing}><Text style={styles.heroRingValue}>{completion}</Text><Text style={styles.heroRingLabel}>of {records.length}</Text></View>
          </View>
          <ProgressBar value={completion} total={records.length} />
          <Text style={styles.heroCaption}>Owned or verified items in your local catalog</Text>
        </View>

        <SectionLabel eyebrow="At a glance" title="Collection status" />
        <View style={styles.metricsRow}>
          <View style={styles.metricSlot}><MetricCard label="Owned" value={counts.Owned} tint="#A8D46F" icon="check-circle" /></View>
          <View style={styles.metricSlot}><MetricCard label="Verified" value={counts.Verified} tint="#8DC6A3" icon="verified" /></View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricSlot}><MetricCard label="Missing link" value={counts["Missing Link"]} tint="#E2B15B" icon="link-off" /></View>
          <View style={styles.metricSlot}><MetricCard label="Not found" value={counts["Not Found"]} tint="#D9827A" icon="help-outline" /></View>
        </View>

        <View style={styles.quickActions}>
          <View style={styles.quickActionShell}>
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: "/catalog" as any, params: { status: "Missing Link" } })} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
              <View style={styles.quickActionInner}>
              <View style={styles.quickActionIcon}><MaterialIcons name="search" size={18} color="#A8D46F" /></View>
              <Text style={styles.quickActionText}>Review gaps</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#687274" />
              </View>
            </Pressable>
          </View>
          <View style={styles.quickActionShell}>
            <Pressable accessibilityRole="button" onPress={() => router.push("/statuses" as any)} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
              <View style={styles.quickActionInner}>
              <View style={styles.quickActionIcon}><MaterialIcons name="dashboard" size={18} color="#A8D46F" /></View>
              <Text style={styles.quickActionText}>Status board</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#687274" />
              </View>
            </Pressable>
          </View>
        </View>

        <SectionLabel eyebrow="Needs attention" title="Continue cataloging" action="See all" onAction={() => router.push({ pathname: "/catalog" as any, params: { status: "Missing Link" } })} />
        {!ready ? <Text style={styles.loading}>Loading local catalog…</Text> : null}
        {ready && needsAttention.length === 0 ? (
          <View style={styles.empty}><StatusBadge status="Owned" /><Text style={styles.emptyTitle}>Nothing needs attention</Text><Text style={styles.emptyText}>Your collection is all caught up.</Text></View>
        ) : (
          <View style={styles.attentionList}>
            {needsAttention.map((item) => (
              <CollectionRow key={item.id} record={item} status={statuses[item.id]} onPress={() => router.push({ pathname: "/item/[id]" as any, params: { id: item.id } })} />
            ))}
          </View>
        )}

        <View style={styles.footerNote}><MaterialIcons name="lock-outline" size={14} color="#687274" /><Text style={styles.footerText}>Stored locally on this device</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 22, paddingBottom: 42 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  kicker: { color: "#81927B", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 6 },
  title: { color: "#F2F0E9", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.9 },
  logoMark: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#1A231D", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#3E4A3A", overflow: "hidden" },
  logoImage: { width: 54, height: 54 },
  heroCard: { backgroundColor: "#243025", borderRadius: 24, padding: 20, overflow: "hidden", borderWidth: 1, borderColor: "#405039", marginBottom: 22 },
  heroGlow: { position: "absolute", width: 220, height: 220, borderRadius: 220, backgroundColor: "#A8D46F", opacity: 0.055, top: -125, right: -55 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  heroLabel: { color: "#A8D46F", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  heroNumber: { color: "#F2F0E9", fontSize: 44, lineHeight: 48, fontWeight: "800", letterSpacing: -1.6, marginTop: 4 },
  heroRing: { width: 70, height: 70, borderRadius: 70, borderWidth: 2, borderColor: "#A8D46F", alignItems: "center", justifyContent: "center" },
  heroRingValue: { color: "#F2F0E9", fontSize: 20, fontWeight: "800", lineHeight: 22 },
  heroRingLabel: { color: "#9AA2A4", fontSize: 10, fontWeight: "700" },
  heroCaption: { color: "#A7B0A8", fontSize: 12, lineHeight: 17, marginTop: 11 },
  metricsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  metricSlot: { width: "48.5%", flexGrow: 0, flexShrink: 0 },
  quickActions: { marginTop: 4, marginBottom: 22, width: "100%" },
  quickActionShell: { width: "100%", minHeight: 52, backgroundColor: "#191D1F", borderRadius: 16, borderWidth: 1, borderColor: "#303A32", marginBottom: 8, overflow: "hidden" },
  quickAction: { width: "100%", minHeight: 52, paddingHorizontal: 12, paddingVertical: 10, flexGrow: 0, flexShrink: 0 },
  quickActionInner: { width: "100%", minHeight: 30, flexDirection: "row", alignItems: "center" },
  quickActionIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#28352A", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  quickActionText: { flex: 1, color: "#F2F0E9", fontWeight: "700", fontSize: 13, marginLeft: 11 },
  pressed: { opacity: 0.65 },
  loading: { color: "#9AA2A4", fontSize: 12, marginBottom: 10 },
  attentionList: { width: "100%" },
  empty: { alignItems: "center", paddingVertical: 28, backgroundColor: "#191D1F", borderRadius: 18, borderWidth: 1, borderColor: "#303A32", marginTop: 3 },
  emptyTitle: { color: "#F2F0E9", fontWeight: "800", fontSize: 15, marginTop: 10 },
  emptyText: { color: "#9AA2A4", fontSize: 12, marginTop: 4 },
  footerNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  footerText: { color: "#687274", fontSize: 11, marginLeft: 6 },
});
