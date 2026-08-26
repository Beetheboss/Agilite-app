import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { CollectionRow, StatusBadge } from "@/components/catalog-ui";
import { ScreenContainer } from "@/components/screen-container";
import { COLLECTION_STATUSES, countStatuses, statusColors } from "@/lib/catalog";
import { useCollectionStore } from "@/lib/collection-store";

export default function StatusesScreen() {
  const { records, statuses } = useCollectionStore();
  const counts = useMemo(() => countStatuses(records, statuses), [records, statuses]);
  const grouped = useMemo(() => COLLECTION_STATUSES.map((status) => ({ status, items: records.filter((record) => statuses[record.id] === status) })), [records, statuses]);

  return (
    <ScreenContainer className="px-5">
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.status}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.group}>
            <View style={styles.groupHeader}><View><Text style={styles.groupCaption}>{item.status === "Owned" ? "IN YOUR COLLECTION" : item.status === "Verified" ? "CONFIRMED RECORDS" : item.status === "Missing Link" ? "RESEARCH QUEUE" : "UNRESOLVED"}</Text><Text style={styles.groupTitle}>{item.status}</Text></View><View style={[styles.groupCount, { borderColor: statusColors[item.status].tint }]}><Text style={[styles.groupCountText, { color: statusColors[item.status].tint }]}>{item.items.length}</Text></View></View>
            {item.items.slice(0, 8).map((record) => <CollectionRow key={record.id} record={record} status={item.status} onPress={() => router.push({ pathname: "/item/[id]" as any, params: { id: record.id } })} />)}
            {item.items.length > 8 ? <Text style={styles.moreText}>+ {item.items.length - 8} more in catalog</Text> : null}
          </View>
        )}
        ListHeaderComponent={<View><Text style={styles.kicker}>PROGRESS BOARD</Text><Text style={styles.title}>Collection states</Text><Text style={styles.subtitle}>A quick view of every record’s current place in your personal catalog.</Text><View style={styles.summary}><Text style={styles.summaryNumber}>{counts.Owned + counts.Verified}</Text><Text style={styles.summaryLabel}>owned or verified</Text><View style={styles.summaryDivider} /><Text style={styles.summaryNumber}>{counts["Missing Link"] + counts["Not Found"]}</Text><Text style={styles.summaryLabel}>need attention</Text></View></View>}
        ListFooterComponent={<View style={styles.footer}><StatusBadge status="Not Found" compact /><Text style={styles.footerText}>Not Found is reserved for items with no verified public link anywhere in the imported catalog.</Text></View>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 22, paddingBottom: 42 },
  kicker: { color: "#81927B", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 7 },
  title: { color: "#F2F0E9", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.9 },
  subtitle: { color: "#9AA2A4", fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 20, maxWidth: 340 },
  summary: { backgroundColor: "#191D1F", borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", borderWidth: 1, borderColor: "#303A32", marginBottom: 30 },
  summaryNumber: { color: "#A8D46F", fontSize: 24, fontWeight: "800" },
  summaryLabel: { color: "#9AA2A4", fontSize: 11, marginLeft: 6, marginRight: 13 },
  summaryDivider: { width: 1, height: 26, backgroundColor: "#35403D", marginRight: 13 },
  group: { marginBottom: 28 },
  groupHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  groupCaption: { color: "#8E9A8B", fontSize: 9, letterSpacing: 1.2, fontWeight: "800", marginBottom: 4 },
  groupTitle: { color: "#F2F0E9", fontSize: 21, lineHeight: 26, fontWeight: "800" },
  groupCount: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#191D1F" },
  groupCountText: { fontSize: 16, fontWeight: "800" },
  moreText: { color: "#A8D46F", fontSize: 12, fontWeight: "700", paddingLeft: 15, marginTop: 2 },
  footer: { flexDirection: "row", alignItems: "center", backgroundColor: "#191D1F", padding: 15, borderRadius: 16, borderWidth: 1, borderColor: "#303A32" },
  footerText: { color: "#9AA2A4", fontSize: 11, lineHeight: 16, flex: 1, marginLeft: 10 },
});
