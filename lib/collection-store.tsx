import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import bundledCatalog from "@/data/catalog.json";
import {
  createDefaultStatusMap,
  type CatalogLinkOverrides,
  type CatalogRecord,
  type CatalogStatusMap,
  type CollectionStatus,
  type RegionKey,
} from "@/lib/catalog";

const STATUS_KEY = "agilite-collection-status-v1";
const LINKS_KEY = "agilite-collection-links-v1";
const catalog = bundledCatalog as CatalogRecord[];

type CollectionStoreValue = {
  records: CatalogRecord[];
  statuses: CatalogStatusMap;
  linkOverrides: CatalogLinkOverrides;
  ready: boolean;
  setStatus: (recordId: string, status: CollectionStatus) => void;
  setLink: (recordId: string, region: RegionKey, value: string) => void;
  reset: () => Promise<void>;
};

const CollectionStoreContext = createContext<CollectionStoreValue | null>(null);

export function CollectionStoreProvider({ children }: PropsWithChildren) {
  const [statuses, setStatuses] = useState<CatalogStatusMap>(() => createDefaultStatusMap(catalog));
  const [linkOverrides, setLinkOverrides] = useState<CatalogLinkOverrides>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([AsyncStorage.getItem(STATUS_KEY), AsyncStorage.getItem(LINKS_KEY)])
      .then(([statusValue, linksValue]) => {
        if (!active) return;
        if (statusValue) {
          try {
            setStatuses({ ...createDefaultStatusMap(catalog), ...(JSON.parse(statusValue) as CatalogStatusMap) });
          } catch {
            setStatuses(createDefaultStatusMap(catalog));
          }
        }
        if (linksValue) {
          try {
            setLinkOverrides(JSON.parse(linksValue) as CatalogLinkOverrides);
          } catch {
            setLinkOverrides({});
          }
        }
      })
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  const records = useMemo(
    () => catalog.map((record) => ({ ...record, ...(linkOverrides[record.id] ?? {}) })),
    [linkOverrides],
  );

  const setStatus = useCallback((recordId: string, status: CollectionStatus) => {
    setStatuses((current) => {
      const next = { ...current, [recordId]: status };
      void AsyncStorage.setItem(STATUS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setLink = useCallback((recordId: string, region: RegionKey, value: string) => {
    setLinkOverrides((current) => {
      const next = { ...current, [recordId]: { ...(current[recordId] ?? {}), [region]: value } };
      void AsyncStorage.setItem(LINKS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    const defaults = createDefaultStatusMap(catalog);
    setStatuses(defaults);
    setLinkOverrides({});
    await Promise.all([AsyncStorage.removeItem(STATUS_KEY), AsyncStorage.removeItem(LINKS_KEY)]);
  }, []);

  const value = useMemo(
    () => ({ records, statuses, linkOverrides, ready, setStatus, setLink, reset }),
    [records, statuses, linkOverrides, ready, setStatus, setLink, reset],
  );

  return <CollectionStoreContext.Provider value={value}>{children}</CollectionStoreContext.Provider>;
}

export function useCollectionStore() {
  const value = useContext(CollectionStoreContext);
  if (!value) throw new Error("useCollectionStore must be used inside CollectionStoreProvider");
  return value;
}
