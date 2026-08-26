export const COLLECTION_STATUSES = ["Owned", "Missing Link", "Verified", "Not Found"] as const;
export type CollectionStatus = (typeof COLLECTION_STATUSES)[number];

export type CatalogRecord = {
  id: string;
  name: string;
  category: string;
  variant: string;
  sku: string;
  usUrl: string;
  israelUrl: string;
  internationalUrl: string;
  usAvailability: string;
  israelAvailability: string;
  internationalAvailability: string;
  source: string;
  evidenceClass: string;
  notes: string;
};

export type CatalogStatusMap = Record<string, CollectionStatus>;
export type RegionKey = "usUrl" | "israelUrl" | "internationalUrl";
export type CatalogLinkOverrides = Record<string, Partial<Record<RegionKey, string>>>;

const hasUrl = (value: string) => value.trim().startsWith("http");

export function defaultStatusFor(record: CatalogRecord): CollectionStatus {
  const urls = [record.usUrl, record.israelUrl, record.internationalUrl];
  if (urls.some(hasUrl)) return "Verified";
  const unavailable = [record.usAvailability, record.israelAvailability, record.internationalAvailability];
  if (unavailable.some((value) => value.toLowerCase().includes("not found"))) return "Not Found";
  return "Missing Link";
}

export function createDefaultStatusMap(records: CatalogRecord[]): CatalogStatusMap {
  return Object.fromEntries(records.map((record) => [record.id, defaultStatusFor(record)]));
}

export function countStatuses(records: CatalogRecord[], statuses: CatalogStatusMap) {
  return COLLECTION_STATUSES.reduce<Record<CollectionStatus, number>>((counts, status) => {
    counts[status] = records.reduce((total, record) => total + (statuses[record.id] === status ? 1 : 0), 0);
    return counts;
  }, { Owned: 0, "Missing Link": 0, Verified: 0, "Not Found": 0 });
}

export function filterRecords(
  records: CatalogRecord[],
  statuses: CatalogStatusMap,
  query: string,
  status: CollectionStatus | "All",
  category: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  return records.filter((record) => {
    const matchesQuery = !normalizedQuery || [record.name, record.category, record.variant, record.sku].join(" ").toLowerCase().includes(normalizedQuery);
    const matchesStatus = status === "All" || statuses[record.id] === status;
    const matchesCategory = category === "All" || record.category === category;
    return matchesQuery && matchesStatus && matchesCategory;
  });
}

export const statusColors: Record<CollectionStatus, { tint: string; background: string }> = {
  Owned: { tint: "#A8D46F", background: "#2B3A28" },
  "Missing Link": { tint: "#E2B15B", background: "#3D3222" },
  Verified: { tint: "#8DC6A3", background: "#22372D" },
  "Not Found": { tint: "#D9827A", background: "#3B2829" },
};
