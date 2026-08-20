# Deep update: QBCore & QBox to ESX Legacy conversion

Integrates `pattern-library-2026-08-20-v2.json` (34 esxToQb + 190 qbToEsx + 10 SQL + 6 custom patterns) as the new base of the Pattern Library, fixes unsafe mappings, adds a QBox/Qbx source option, and upgrades the conversion engine from plain string replace to a metadata-aware engine.

## 1. Pattern schema (extended, backwards compatible)

Existing fields (`from`, `to`, `category`, `direction`) stay required. New optional fields:

- `sourceFramework`: `"qbcore" | "qbox"` or an array of both (the V2 file already uses arrays, supported as-is)
- `targetFramework`: `"esx" | "qb"`
- `type`: `direct | semantic | manual | resource-specific | deprecated`
- `priority`: number (higher wins)
- `scope`: `client | server | both`
- `requires`: string[] (e.g. `["ox_lib"]`)
- `confidence`: `high | medium | low` (already present in V2)
- `notes`: string, shown in the UI and in the conversion report

Patterns without `sourceFramework` remain valid generic fallbacks.

## 2. Pattern library data

`src/data/patterns.ts` is replaced by modules built from the V2 file: `patterns/esxToQb.ts`, `patterns/qbToEsx.ts` (QBCore-specific, QBox-specific, generic), `patterns/sql.ts`, plus an index exporting the merged library. Every V2 pattern is carried over; corrected or downgraded entries keep a `notes` field explaining the change.

Corrections applied (each with a note):

- Inventory: `Player.Functions.AddItem/RemoveItem/GetItemByName/HasItem/GetItemsByName` map to `exports.ox_inventory:AddItem/RemoveItem/GetItem/Search/GetItemCount/CanCarryItem` (semantic; argument order and metadata differences documented). Any `RemoveItem -> removeWeaponComponent` style mapping is removed as invalid.
- Money: `AddMoney/RemoveMoney/SetMoney` split per account (`cash -> money`, `bank -> bank`, `black_money`); unknown or custom account types become `manual`.
- Events: resource-specific events (e.g. `hospital:server:SetDeathStatus`) reclassified as `resource-specific`/`manual` instead of being equated with `esx:onPlayerDeath`. Only real framework events map directly.
- UI: notify / text UI / progress / menu / input all target ox_lib (`lib.notify`, `lib.showTextUI` + `lib.hideTextUI`, `lib.progressBar` / `lib.progressCircle`, `lib.registerContext` + `lib.showContext`, `lib.inputDialog`).
- Target: full `qb-target -> ox_target` set (entity, model, box/circle/poly zone, global vehicle/player/object, removals) with option-shape adaptation notes (`label`, `icon`, `event`/`onSelect`, `distance`, `groups` from `job`/`gang`, `items`, `canInteract`).
- SQL: modern oxmysql await APIs (`MySQL.query.await`, `single`, `scalar`, `insert`, `update`, `prepare`) from mysql-async, ghmattimysql and QB SQL wrappers.
- QBox: dedicated `exports.qbx_core:*` patterns (GetPlayer, GetPlayerByCitizenId, GetPlayers, GetJobs/GetGangs/GetGroups, money APIs, Notify, SetJob, SetJobDuty, CreateUseableItem, metadata) with higher priority than the QBCore bridge equivalents.
- Player data / job / metadata, vehicles, commands (`QBCore.Commands.Add -> ESX.RegisterCommand`), weapons, routing buckets and entities are reviewed and completed; non 1:1 cases marked `semantic` or `manual`.

New categories cover the requested list: Money/Accounts, Inventory, Weapons, Weapon Components, Jobs, Gangs, Metadata, Callbacks, Commands, Notifications, TextUI, Progress, Menus, Input, Target, Vehicles, Entities, Routing Buckets, oxmysql, ox_lib, ox_target, ox_inventory, QBox/qbx_core, Resource-specific, Manual Conversion.

Mappings are validated against current ESX Legacy, QBCore, qbx_core, ox_lib, ox_inventory, ox_target and oxmysql documentation. The V2 file stays the base; docs only validate, correct and extend it.

## 3. Conversion engine (`src/utils/converter.ts`)

Rewritten as a pipeline while keeping the existing exported API:

1. Filter patterns by `direction`, the active `sourceFramework`, and file scope (filename and `client`/`server` heuristics plus fx_manifest hints).
2. Sort by `priority`, then specificity (qbox > qbcore > generic), then `from` length.
3. Apply per type:
   - `direct`: escaped literal replacement (current behaviour).
   - `semantic`: argument-aware transform producing the adapted call; falls back to a replacement plus an inline `-- TODO` note when arguments cannot be parsed.
   - `manual` / `resource-specific`: no code rewrite; annotates the line with a `-- MANUAL:` comment and records the finding.
4. Results gain `manualItems` and `warnings`, surfaced on the Results page and in the generated markdown report.

No pattern rewrites code when a safe equivalent does not exist.

## 4. Interface

- Home: the framework selector becomes three explicit options - `ESX -> QB-Core`, `QB-Core -> ESX Legacy`, `QBox / Qbx -> ESX Legacy`. The last two both set `direction: 'qb-to-esx'` and differ only by `sourceFramework`.
- Store: new `sourceFramework` state feeding `getAllPatterns()`.
- Patterns page: source-framework filter, type and confidence badges, notes column, counters, categories and search updated for the new fields; the add/edit dialog gains the new optional fields; export/import handle the v2 schema (v1 imports still accepted).
- Results: a separate section listing manual / resource-specific items per file.
- Help page updated for the new direction and the target stack.

## 5. Tests

Vitest suite under `src/utils/__tests__/`:

- QBCore fixtures: GetCoreObject, GetPlayerData, GetPlayer, money APIs, item APIs, Notify, Progressbar, qb-menu, qb-input, qb-target, CreateCallback, CreateUseableItem.
- QBox fixtures: all `qbx_core` APIs listed in the request, asserting QBox patterns win over generic QBCore ones.
- ox_inventory, ox_lib, ox_target and SQL output assertions.
- Safety tests: no `AddItem -> setInventoryItem`, no `RemoveItem -> removeWeaponComponent`, no accountless `SetMoney -> setAccountMoney`, no invented ESX events from resource events.
- Library integrity: every pattern validates against the schema, no duplicate `from` within the same direction plus framework.

## 6. Final report

After implementation: changed files, final library structure, total patterns and counts per direction / framework / ox resource / SQL, corrected mappings, new mappings, manual-marked patterns, tests created, and remaining limitations.