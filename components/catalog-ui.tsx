import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { statusColors, type CatalogRecord, type CollectionStatus } from "@/lib/catalog";
import { catalogImageSources } from "@/lib/catalog-images";

export function StatusBadge({ status, compact = false }: { status: CollectionStatus; compact?: boolean }) {
  const colors = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: colors.background, borderColor: `${colors.tint}55` }, compact && styles.badgeCompact]}>
      <View style={[styles.badgeDot, { backgroundColor: colors.tint }]} />
      <Text style={[styles.badgeText, { color: colors.tint }, compact && styles.badgeTextCompact]}>{status}</Text>
    </View>
  );
}

export function MetricCard({ label, value, tint, icon }: { label: string; value: number; tint: string; icon: keyof typeof MaterialIcons.glyphMap }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${tint}22` }]}>
        <MaterialIcons name={icon} size={18} color={tint} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function CollectionRow({ record, status, onPress }: { record: CatalogRecord; status: CollectionStatus; onPress: () => void }) {
  const colors = statusColors[status];
  const regionCount = [record.usUrl, record.israelUrl, record.internationalUrl].filter((url) => url.startsWith("http")).length;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.rowPressable, pressed && styles.rowPressed]}>
      <View style={styles.rowCard}>
        <View style={[styles.rowMarker, { backgroundColor: colors.tint }]} />
        {catalogImageSources[record.id] ? <Image source={catalogImageSources[record.id]} style={styles.rowImage} resizeMode="contain" /> : <View style={styles.rowImagePlaceholder}><MaterialIcons name="image-not-supported" size={18} color="#687274" /></View>}
        <View style={styles.rowBody}>
          <View style={styles.rowTopLine}>
            <Text style={styles.rowTitle} numberOfLines={1}>{record.name || "Unnamed catalog item"}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#687274" />
          </View>
          <View style={styles.rowMeta}>
            <Text style={styles.rowCategory}>{record.category}</Text>
            <Text style={styles.rowSeparator}>•</Text>
            <Text style={styles.rowRegions}>{regionCount}/3 regions</Text>
          </View>
        </View>
        <StatusBadge status={status} compact />
      </View>
    </Pressable>
  );
}

export function ProgressBar({ value, total, tint = "#A8D46F" }: { value: number; total: number; tint?: string }) {
  const percent = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: tint }]} />
    </View>
  );
}

export function SectionLabel({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action && onAction ? <Pressable onPress={onAction} style={({ pressed }) => [styles.sectionAction, pressed && styles.pressed]}><Text style={styles.sectionActionText}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.emptyState}>
      <MaterialIcons name="inventory-2" size={30} color="#687274" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  badgeCompact: { paddingHorizontal: 8, paddingVertical: 5 },
  badgeDot: { width: 6, height: 6, borderRadius: 6, marginRight: 6 },
  badgeText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.1 },
  badgeTextCompact: { fontSize: 10 },
  metricCard: { backgroundColor: "#191D1F", borderRadius: 18, padding: 14, minHeight: 88, flex: 1, borderWidth: 1, borderColor: "#303A32" },
  metricIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  metricValue: { color: "#F2F0E9", fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  metricLabel: { color: "#9AA2A4", fontSize: 11, marginTop: 3, fontWeight: "600" },
  rowPressable: { width: "100%", marginBottom: 9, flexGrow: 0, flexShrink: 0 },
  rowCard: { width: "100%", flexGrow: 0, flexShrink: 0, alignSelf: "stretch", backgroundColor: "#191D1F", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#303A32", overflow: "hidden" },
  rowPressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  rowMarker: { width: 3, height: 48, borderRadius: 4, flexShrink: 0 },
  rowImage: { width: 48, height: 48, borderRadius: 12, marginLeft: 9, backgroundColor: "#F1F0EC", flexShrink: 0, borderWidth: 1, borderColor: "#E3E3DD" },
  rowImagePlaceholder: { width: 48, height: 48, borderRadius: 12, marginLeft: 9, backgroundColor: "#242A2B", alignItems: "center", justifyContent: "center", flexShrink: 0, borderWidth: 1, borderColor: "#303A32" },
  rowBody: { flex: 1, minWidth: 0, justifyContent: "center", marginHorizontal: 10 },
  rowTopLine: { minHeight: 18, flexDirection: "row", alignItems: "center" },
  rowTitle: { color: "#F2F0E9", fontSize: 13.5, fontWeight: "700", lineHeight: 18, flex: 1 },
  rowMeta: { minHeight: 15, flexDirection: "row", alignItems: "center", marginTop: 2 },
  rowCategory: { color: "#A8D46F", fontSize: 11, fontWeight: "700", marginRight: 6 },
  rowSeparator: { color: "#687274", fontSize: 11, marginRight: 6 },
  rowRegions: { color: "#858E90", fontSize: 11 },
  progressTrack: { height: 7, borderRadius: 8, backgroundColor: "#303A32", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 13 },
  eyebrow: { color: "#8E9A8B", textTransform: "uppercase", letterSpacing: 1.3, fontSize: 10, fontWeight: "800", marginBottom: 4 },
  sectionTitle: { color: "#F2F0E9", fontSize: 19, lineHeight: 24, fontWeight: "800", letterSpacing: -0.25 },
  sectionAction: { paddingHorizontal: 4, paddingVertical: 6 },
  sectionActionText: { color: "#A8D46F", fontSize: 13, fontWeight: "800" },
  pressed: { opacity: 0.6 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 44, paddingHorizontal: 24, backgroundColor: "#191D1F", borderRadius: 18, borderWidth: 1, borderColor: "#303A32" },
  emptyTitle: { color: "#F2F0E9", fontSize: 17, fontWeight: "800", marginTop: 12 },
  emptyMessage: { color: "#9AA2A4", textAlign: "center", lineHeight: 20, marginTop: 6, fontSize: 13 },
});
