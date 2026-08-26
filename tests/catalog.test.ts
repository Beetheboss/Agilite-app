import { describe, expect, it } from "vitest";

import { countStatuses, createDefaultStatusMap, filterRecords, type CatalogRecord } from "@/lib/catalog";

const records: CatalogRecord[] = [
  { id: "1", name: "Owned Patch", category: "Patches / Collectibles", variant: "", sku: "", usUrl: "https://example.com/owned", israelUrl: "", internationalUrl: "", usAvailability: "Working link", israelAvailability: "Not available in Israel", internationalAvailability: "Not available in International", source: "test", evidenceClass: "verified", notes: "" },
  { id: "2", name: "Missing Hat", category: "Hats / Headwear", variant: "", sku: "", usUrl: "", israelUrl: "", internationalUrl: "", usAvailability: "", israelAvailability: "", internationalAvailability: "", source: "test", evidenceClass: "", notes: "" },
  { id: "3", name: "No Link Shirt", category: "Apparel", variant: "", sku: "", usUrl: "", israelUrl: "", internationalUrl: "", usAvailability: "Not found publicly", israelAvailability: "Not found publicly", internationalAvailability: "Not found publicly", source: "test", evidenceClass: "", notes: "" },
];

describe("catalog helpers", () => {
  it("derives verified and missing default states", () => {
    const statuses = createDefaultStatusMap(records);
    expect(statuses).toEqual({ "1": "Verified", "2": "Missing Link", "3": "Not Found" });
  });

  it("counts statuses", () => {
    expect(countStatuses(records, { "1": "Owned", "2": "Missing Link", "3": "Not Found" })).toEqual({ Owned: 1, "Missing Link": 1, Verified: 0, "Not Found": 1 });
  });

  it("filters by query, status, and category", () => {
    const statuses = { "1": "Owned", "2": "Missing Link", "3": "Not Found" } as const;
    expect(filterRecords(records, statuses, "hat", "All", "All").map((item) => item.id)).toEqual(["2"]);
    expect(filterRecords(records, statuses, "", "Not Found", "All").map((item) => item.id)).toEqual(["3"]);
    expect(filterRecords(records, statuses, "", "All", "Patches / Collectibles").map((item) => item.id)).toEqual(["1"]);
  });
});
