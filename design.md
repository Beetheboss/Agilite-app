# Agilite Collection Tracker — Interface Design Plan

## Product intent

Agilite Collection Tracker is a private, offline-first catalog for tracking the user’s Agilite collectible patches and merchandise. The first launch ships with the user’s existing 110-record catalog preloaded from `Agilite.xlsx`. The app does not require an account, cloud sync, backend processing, or automated web research.

## Design direction

The interface follows mainstream iOS Human Interface Guidelines while using a restrained tactical-catalog visual language: near-black graphite surfaces, warm off-white text, muted olive accents, and a high-visibility green reserved for verified or owned states. It is designed for one-handed portrait use, with primary actions placed in the lower half of the screen and compact, scannable cards rather than dense spreadsheet layouts.

Primary colors:

| Token | Color | Use |
|---|---|---|
| Graphite | `#121416` | Main background |
| Slate surface | `#1B1F22` | Cards and grouped sections |
| Warm white | `#F2F0E9` | Primary text |
| Ash gray | `#9AA2A4` | Secondary text |
| Signal green | `#A8D46F` | Owned, verified, progress indicators |
| Amber | `#E2B15B` | Missing-link attention state |
| Muted red | `#D9827A` | Not-found state |
| Olive line | `#3E4A3A` | Borders and dividers |

## Screen list

### 1. Collection dashboard

The home screen presents the collection at a glance: total records, owned count, verified count, missing-link count, and not-found count. A progress ring and four compact status cards make the current research and collecting progress immediately visible. A “Continue cataloging” section shows the next few unresolved records so the user can jump directly into them.

### 2. Catalog

The catalog screen is the main searchable list. It contains a search field, a horizontal status filter, and a category filter for patches, hats/headwear, shirts/apparel, and promotional merchandise. Each row shows the product name, category, status badge, and a small regional-link summary. The list uses `FlatList` for smooth scrolling and keeps filter controls within thumb reach.

### 3. Item detail

The detail screen shows the product name, category, SKU when available, current status, and the three regional link states: US, Israel, and International. A product can be marked Owned, Missing Link, Verified, or Not Found using a segmented status control. The screen also shows the evidence/source note imported from the workbook and clarifies that a regional absence does not mean the product is globally missing.

### 4. Status board

The status board groups all records into four large sections: Owned, Verified, Missing Link, and Not Found. Each section includes a count and a short explanatory caption. This is the quickest screen for reviewing progress and finding the six records that currently have no surviving public link anywhere.

### 5. Settings and data

Settings is intentionally small and local. It shows the catalog version, the number of imported records, a “Reset to original catalog” action, and an explanation that data is stored only on the device. It also includes a compact legend for the four statuses. No login, cloud account, or remote synchronization is presented.

## Key user flows

### Mark an item as owned

User opens the dashboard → taps the unresolved-items card → taps a product → selects **Owned** → sees an immediate green confirmation state → returns to the list with the updated count.

### Review missing links

User opens the catalog → taps the **Missing Link** filter → selects a record → reviews the three regional link states → optionally changes the status to **Verified** or **Not Found** based on their own evidence → returns to the filtered list.

### Browse the whole collection

User opens Catalog → types a name such as “Ukraine” or “Testing Team” → results narrow immediately → user taps a result → detail screen presents status, category, SKU, and regional evidence.

### Restore the original imported catalog

User opens Settings → taps Reset catalog → confirms in a native alert → the app restores the bundled 110-record starting dataset and recalculates all dashboard counts.

## Data model vocabulary

Each catalog record has a stable ID, product name, category, optional variant/options, optional SKU list, US/Israel/International URLs, regional availability labels, a status, source/evidence class, and notes. The app stores user status changes locally with AsyncStorage. The original imported record data remains available as the reset baseline.

## Interaction and accessibility rules

All primary controls use at least 44 points of touch area. Status colors are paired with text labels and are never the only signal. Empty results explain how to clear filters. Text uses comfortable line height and supports Dynamic Type where available. Press feedback is subtle opacity/scale feedback, and destructive reset actions require confirmation. The app remains usable without network access.
