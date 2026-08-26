import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { StatusBadge } from "@/components/catalog-ui";
import { COLLECTION_STATUSES, statusColors, type RegionKey } from "@/lib/catalog";
import { useCollectionStore } from "@/lib/collection-store";
import { catalogImageSources } from "@/lib/catalog-images";

const regions = [
  { key: "US", urlKey: "usUrl", availabilityKey: "usAvailability" },
  { key: "Israel", urlKey: "israelUrl", availabilityKey: "israelAvailability" },
  { key: "International", urlKey: "internationalUrl", availabilityKey: "internationalAvailability" },
] as const;

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { records, statuses, setStatus, setLink } = useCollectionStore();
  const [editingRegion, setEditingRegion] = useState<RegionKey | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const record = useMemo(() => records.find((item) => item.id === id), [records, id]);
  const recordId = record?.id;
  useEffect(() => {
    if (!recordId) return;
    setEditingRegion(null);
    setLinkDraft("");
  }, [recordId]);
  if (!record) return <ScreenContainer className="px-5"><Text style={styles.missing}>Record not found.</Text></ScreenContainer>;
  const current = statuses[record.id];

  const beginEditLink = (region: RegionKey) => {
    setEditingRegion(region);
    setLinkDraft(record[region]);
  };

  const closeEditor = () => {
    Keyboard.dismiss();
    setEditingRegion(null);
    setLinkDraft("");
  };

  const saveLink = (region: RegionKey) => {
    const value = linkDraft.trim();
    if (value && !/^https?:\/\//i.test(value)) {
      Alert.alert("Invalid link", "Enter a full link beginning with https:// or http://.");
      return;
    }
    setLink(record.id, region, value);
    Keyboard.dismiss();
    setEditingRegion(null);
    setLinkDraft("");
    Alert.alert("Link saved", `${region === "usUrl" ? "US" : region === "israelUrl" ? "Israel" : "International"} link updated on this device.`);
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><MaterialIcons name="arrow-back" size={20} color="#F2F0E9" /><Text style={styles.backText}>Catalog</Text></Pressable>
        <View style={styles.hero}>
          {catalogImageSources[record.id] ? <Image source={catalogImageSources[record.id]} style={styles.heroImage} resizeMode="contain" /> : <View style={styles.heroImagePlaceholder}><MaterialIcons name="image-not-supported" size={28} color="#8E9A8B" /><Text style={styles.heroImageText}>No public product image collected</Text></View>}
          <View style={styles.categoryPill}><Text style={styles.categoryText}>{record.category}</Text></View>
          <Text style={styles.title}>{record.name}</Text>
          {record.variant ? <Text style={styles.variant}>{record.variant}</Text> : null}
          <StatusBadge status={current} />
        </View>
        <Text style={styles.sectionTitle}>Set collection status</Text>
        <View style={styles.statusGrid}>{COLLECTION_STATUSES.map((status) => { const active = current === status; const color = statusColors[status]; return <Pressable key={status} onPress={() => setStatus(record.id, status)} style={[styles.statusOption, active && { borderColor: color.tint, backgroundColor: color.background }]}><View style={[styles.statusDot, { backgroundColor: color.tint }]} /><Text style={[styles.statusOptionText, active && { color: color.tint }]}>{status}</Text>{active ? <MaterialIcons name="check" size={17} color={color.tint} /> : null}</Pressable>; })}</View>
        <Text style={styles.sectionTitle}>Regional evidence</Text>
        <Text style={styles.sectionHint}>Tap Open to visit a working URL, or edit any region to add or replace its link.</Text>
        <View style={styles.card}>{regions.map((region) => { const url = record[region.urlKey]; const availability = record[region.availabilityKey]; const hasUrl = url.startsWith("http"); const content = <><View style={styles.regionIcon}><MaterialIcons name={hasUrl ? "link" : "link-off"} size={17} color={hasUrl ? "#A8D46F" : "#E2B15B"} /></View><View style={styles.regionBody}><Text style={styles.regionName}>{region.key}</Text><Text style={[styles.regionStatus, { color: hasUrl ? "#A8D46F" : "#E2B15B" }]}>{hasUrl ? "Working link" : availability || "No public link recorded"}</Text></View>{hasUrl ? <View style={styles.openButton}><Text style={styles.openText}>Open</Text><MaterialIcons name="open-in-new" size={14} color="#162018" style={styles.openIcon} /></View> : null}</>; return <View key={region.key} style={styles.regionRow}>{hasUrl ? <Pressable accessibilityRole="link" accessibilityLabel={`Open ${region.key} product link`} onPress={() => Linking.openURL(url)} style={({ pressed }) => [styles.regionLinkArea, pressed && styles.pressed]}>{content}</Pressable> : <View style={styles.regionLinkArea}>{content}</View>}<Pressable accessibilityRole="button" accessibilityLabel={`Edit ${region.key} product link`} onPress={() => beginEditLink(region.urlKey)} style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}><MaterialIcons name="edit" size={17} color="#A8D46F" /></Pressable></View>; })}</View>
        <Modal visible={editingRegion !== null} animationType="slide" transparent onRequestClose={closeEditor}>
          <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.editorSheet}>
              <View style={styles.editorHeader}><Text style={styles.editorTitle}>Edit {editingRegion === "usUrl" ? "US" : editingRegion === "israelUrl" ? "Israel" : "International"} link</Text><Pressable onPress={closeEditor} accessibilityRole="button" accessibilityLabel="Close link editor" style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}><MaterialIcons name="close" size={20} color="#F2F0E9" /></Pressable></View>
              <Text style={styles.editorHint}>Paste a full product URL beginning with https:// or http://.</Text>
              <TextInput value={linkDraft} onChangeText={setLinkDraft} autoFocus autoCapitalize="none" autoCorrect={false} keyboardType="url" returnKeyType="done" onSubmitEditing={() => editingRegion && saveLink(editingRegion)} placeholder="https://..." placeholderTextColor="#7E8980" style={styles.linkInput} />
              <View style={styles.editActions}><Pressable onPress={() => editingRegion && saveLink(editingRegion)} accessibilityRole="button" accessibilityLabel="Save link" style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}><Text style={styles.saveText}>Save link</Text></Pressable><Pressable onPress={closeEditor} accessibilityRole="button" accessibilityLabel="Cancel link edit" style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}><Text style={styles.cancelText}>Cancel</Text></Pressable></View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <Text style={styles.sectionTitle}>Record details</Text>
        <View style={styles.card}><Detail label="SKU" value={record.sku || "Not recorded"} /><Detail label="Evidence" value={record.evidenceClass || "Not classified"} /><Detail label="Source" value={record.source || "Imported catalog"} /><Detail label="Notes" value={record.notes || "No notes recorded"} last /></View>
        <View style={styles.localNote}><MaterialIcons name="lock-outline" size={16} color="#A8D46F" /><Text style={styles.localText}>Your status changes are stored only on this device.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Detail({ label, value, last }: { label: string; value: string; last?: boolean }) { return <View style={[styles.detailRow, last && styles.lastRow]}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 20, paddingBottom: 44 },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", paddingVertical: 8, paddingRight: 12, marginBottom: 18 },
  backText: { color: "#A8D46F", fontSize: 13, fontWeight: "800", marginLeft: 7 },
  pressed: { opacity: 0.6 },
  hero: { backgroundColor: "#243025", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#405039", marginBottom: 28 },
  heroImage: { width: "100%", height: 184, borderRadius: 17, backgroundColor: "#F1F0EC", marginBottom: 17, borderWidth: 1, borderColor: "#E3E3DD" },
  heroImagePlaceholder: { width: "100%", height: 120, borderRadius: 16, backgroundColor: "#1B1F22", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  heroImageText: { color: "#8E9A8B", fontSize: 11, marginTop: 7 },
  categoryPill: { alignSelf: "flex-start", backgroundColor: "#334330", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 14 },
  categoryText: { color: "#A8D46F", fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  title: { color: "#F2F0E9", fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.7, marginBottom: 9 },
  variant: { color: "#A7B0A8", fontSize: 12, lineHeight: 18, marginBottom: 14 },
  sectionTitle: { color: "#F2F0E9", fontSize: 19, fontWeight: "800", marginBottom: 6, marginTop: 4 },
  sectionHint: { color: "#8E9A8B", fontSize: 11, lineHeight: 17, marginBottom: 11 },
  statusGrid: { marginBottom: 26 },
  statusOption: { minHeight: 54, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, borderRadius: 16, backgroundColor: "#191D1F", borderWidth: 1, borderColor: "#303A32", marginBottom: 9 },
  statusDot: { width: 9, height: 9, borderRadius: 9, marginRight: 10 },
  statusOptionText: { color: "#D7D9D4", fontSize: 14, fontWeight: "700", flex: 1 },
  card: { backgroundColor: "#191D1F", borderRadius: 18, borderWidth: 1, borderColor: "#303A32", paddingHorizontal: 14, marginBottom: 28 },
  regionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#303A32" },
  regionLinkArea: { flex: 1, flexDirection: "row", alignItems: "center", minWidth: 0 },
  editButton: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", marginLeft: 8, backgroundColor: "#28352A", borderWidth: 1, borderColor: "#405039" },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.58)" },
  editorSheet: { backgroundColor: "#191D1F", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: "#506047" },
  editorHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  editorTitle: { color: "#F2F0E9", fontSize: 18, fontWeight: "800" },
  editorHint: { color: "#A7B0A8", fontSize: 12, lineHeight: 18, marginBottom: 12 },
  closeButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  linkInput: { minHeight: 44, borderWidth: 1, borderColor: "#506047", borderRadius: 11, paddingHorizontal: 12, color: "#F2F0E9", backgroundColor: "#121719", fontSize: 13 },
  editActions: { flexDirection: "row", alignItems: "center", marginTop: 9 },
  saveButton: { backgroundColor: "#A8D46F", borderRadius: 12, minHeight: 44, justifyContent: "center", paddingHorizontal: 16, paddingVertical: 9 },
  saveText: { color: "#162018", fontSize: 11, fontWeight: "800" },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 9, marginLeft: 6 },
  cancelText: { color: "#A7B0A8", fontSize: 11, fontWeight: "800" },
  regionIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: "#28302E", alignItems: "center", justifyContent: "center" },
  regionBody: { flex: 1, marginLeft: 10 },
  regionName: { color: "#F2F0E9", fontSize: 14, fontWeight: "800" },
  regionStatus: { fontSize: 11, marginTop: 3 },
  openButton: { backgroundColor: "#A8D46F", borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8, flexDirection: "row", alignItems: "center" },
  openText: { color: "#162018", fontSize: 11, fontWeight: "800" },
  openIcon: { marginLeft: 5 },
  detailRow: { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#2A302F" },
  lastRow: { borderBottomWidth: 0 },
  detailLabel: { color: "#8E9A8B", textTransform: "uppercase", fontSize: 9, fontWeight: "800", letterSpacing: 1.1, marginBottom: 4 },
  detailValue: { color: "#E0E2DC", fontSize: 13, lineHeight: 19 },
  localNote: { flexDirection: "row", alignItems: "center", paddingVertical: 3 },
  localText: { color: "#8E9A8B", fontSize: 11, flex: 1, marginLeft: 9 },
  missing: { color: "#F2F0E9", fontSize: 20, paddingTop: 40 },
});
