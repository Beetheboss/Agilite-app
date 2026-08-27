import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { CollectionRow, EmptyState, SectionLabel } from "@/components/catalog-ui";
import { ScreenContainer } from "@/components/screen-container";
import { COLLECTION_STATUSES, filterRecords, type CollectionStatus } from "@/lib/catalog";
import { useCollectionStore } from "@/lib/collection-store";

const categories = ["All", "Patches / Collectibles", "Hats / Headwear", "Apparel", "Promotional / Other Merchandise"];

export default function CatalogScreen() {
  const { records, statuses } = useCollectionStore();
  const params = useLocalSearchParams<{ status?: string }>();
  const initialStatus = COLLECTION_STATUSES.includes(params.status as CollectionStatus) ? (params.status as CollectionStatus) : "All";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CollectionStatus | "All">(initialStatus);
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => filterRecords(records, statuses, query, status, category), [records, statuses, query, status, category]);

  return (
    <ScreenContainer className="px-5">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CollectionRow record={item} status={statuses[item.id]} onPress={() => router.push({ pathname: "/item/[id]" as any, params: { id: item.id } })} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <Text style={styles.kicker}>LOCAL CATALOG</Text>
            <View style={styles.titleRow}><Text style={styles.title}>All collectibles</Text><Text style={styles.count}>{filtered.length}</Text></View>
            <View style={styles.searchBox}><MaterialIcons name="search" size={20} color="#687274" /><TextInput value={query} onChangeText={setQuery} placeholder="Search names, SKUs, categories" placeholderTextColor="#687274" style={styles.searchInput} returnKeyType="done" /></View>
            <SectionLabel eyebrow="Filter by status" title="Collection state" />
            <FlatList horizontal data={["All", ...COLLECTION_STATUSES]} keyExtractor={(item) => item} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList} renderItem={({ item }) => { const active = status === item; return <Pressable onPress={() => setStatus(item as CollectionStatus | "All")} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text></Pressable>; }} />
            <SectionLabel eyebrow="Filter by type" title="Merchandise type" />
            <FlatList horizontal data={categories} keyExtractor={(item) => item} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList} renderItem={({ item }) => { const active = category === item; return <Pressable onPress={() => setCategory(item)} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text></Pressable>; }} />
            <View style={styles.resultLabel}><Text style={styles.resultText}>{filtered.length} {filtered.length === 1 ? "record" : "records"}</Text><Text style={styles.resultHint}>Tap an item to update status</Text></View>
          </View>
        }
        ListEmptyComponent={<EmptyState title="No matching records" message="Try another search or clear one of the filters." />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 22, paddingBottom: 42 },
  headerContent: { paddingHorizontal: 20 },
  kicker: { color: "#81927B", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 7 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { color: "#F2F0E9", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.9 },
  count: { color: "#A8D46F", fontSize: 15, fontWeight: "800", backgroundColor: "#233025", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 13, borderWidth: 1, borderColor: "#405039" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#191D1F", borderWidth: 1, borderColor: "#303A32", borderRadius: 16, paddingHorizontal: 14, height: 52, marginBottom: 28 },
  searchInput: { flex: 1, color: "#F2F0E9", fontSize: 14, marginLeft: 9 },
  chipList: { paddingBottom: 22, paddingRight: 4 },
  chip: { borderWidth: 1, borderColor: "#35403D", backgroundColor: "#191D1F", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, marginRight: 8 },
  chipActive: { backgroundColor: "#A8D46F", borderColor: "#A8D46F" },
  chipText: { color: "#A9B1B0", fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: "#162018" },
  resultLabel: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 1, paddingBottom: 2, marginBottom: 13 },
  resultText: { color: "#F2F0E9", fontSize: 13, fontWeight: "800" },
  resultHint: { color: "#7F8A84", fontSize: 11 },
});
