## Epic 1: Foundations, Local Storage & Theming Tokens

*Focus: Establish project runtimes, zero-dependency token themes, IndexedDB schema creation, and runtime safety wrappers.*

### Sprint 1: Local-First Storage Strategy & Encryption Baseline

* **DoD:** Complete IndexedDB storage wrapper (`src/lib/storage/idb.ts`) with cryptographic safe-handling interfaces for sensitive PII.
* **User Journey:** Core persistence layer initializes without external network constraints on all target platforms.
* **Implementation Specs:**
* Initialize IndexedDB using native browser API wrapped in reactive Svelte stores.
* Create tables for: `projects`, `notes`, `tasks`, `documents`, `time_logs`, `launchpad_links`, `settings`.
* Include schema versioning handles and automated database migration lifecycle scripts.
* Add deterministic tracking metadata hooks to every model: `created_at`, `updated_at`, `deleted_at`, `synced_at`.


* **Testing Protocol:**
* *Vitest:* Write unit tests mocking IndexedDB storage transactions, indexing retrieval benchmarks, and out-of-bounds mutation protections.



### Sprint 2: Dynamic CSS Theme Engine & Token Configuration

* **DoD:** Implementation of `src/lib/theme/` token mapper, fallback logic parsing system appearances, and the custom theme presets engine.
* **User Journey:** User views text, fields, borders, and buttons changing color instantly via structural CSS variables with no flickering or full-app state flashes.
* **Implementation Specs:**
* Write tailwind theme binding extensions map over variable hooks (`--bg-primary`, `--text-main`, `--border-custom`, etc.).
* Implement user configuration reactive stores loading values from settings store.
* Build theme switching helper supporting `system | light | dark` configurations.
* *Constraint Check:* Zero hardcoded color/font classes allowed inside components.


* **Testing Protocol:**
* *Vitest:* Confirm utility mapping produces standard hex string values out of custom CSS configuration rules.
* *Playwright:* Validate theme classes apply properly to document node bindings across standard simulated media queries.



### Sprint 3: Environment Bootstrapping & Tauri Runtime Bridges

* **DoD:** Configuration of multi-target runtimes (`src-tauri` core configurations) alongside web fallback wrappers for file systems and local state windows.
* **User Journey:** User starts up application on native platform or standard browser environment cleanly with seamless initialization.
* **Implementation Specs:**
* Configure `tauri.conf.json` ensuring explicit permission isolation and system API protections.
* Create runtime environment abstract detection layer (`src/lib/utils/runtime.ts`).
* Inject fallback behaviors routing file downloads, app window management, and background loop cycles appropriately depending on desktop vs web detection.


* **Testing Protocol:**
* *Vitest:* Test platform analyzer patterns against user agent mutations and environment window flags.



---

## Epic 2: Core Platform Shell & Globals Layout

*Focus: Structural layouts, global controls framework, obfuscation filters engine, and icon distribution orchestration.*

### Sprint 4: Global Structural Navigation Split Pane

* **DoD:** Layout rendering of persistent Left Sidebar (Clerk tabs, projects shortcuts) paired dynamically against Top Bar controls and Main Canvas layout view container.
* **User Journey:** User operates views smoothly by cycling tabs or clicking sidebar targets while layout maintains fluid response.
* **Implementation Specs:**
* Create layout structural partitions enforcing zero layout shifts and strict container overflow rules for 60 FPS scrolling.
* Implement dynamic display tabs routing state management cleanly using lightweight global UI stores.
* Integrate missing icon provisioning fallback loop (`public/icons/blank/` and script verification).


* **Testing Protocol:**
* *Playwright:* Automated view assertions looking for elements positioning compliance across standard viewport scale configurations (Web, Desktop, Mobile views).



### Sprint 5: System Ternary Control Filters (Theme, Sync, Obfuscation)

* **DoD:** Functional integration of top layout control arrays containing reactive ternary obfuscation triggers and sync status widgets.
* **User Journey:** User cycles obfuscation switch to blur text elements on screens to safely prevent side-glance PII leaks in open public spaces.
* **Implementation Specs:**
* Implement obfuscation selector binding global CSS class states: `.obfuscate-all`, `.obfuscate-some`, `.obfuscate-none`.
* Configure utility components applying conditional visual blur parameters (`backdrop-filter: blur(8px)`) matching mockup presentation.
* Add active sync indicator updating seamlessly via background pipeline notifications.


* **Testing Protocol:**
* *Playwright:* Check for explicit element attribute and class injections alongside verification that target elements contain active styling rules.



---

## Epic 3: Main Views Construction

*Focus: Calendar grids, Launchpad tile layouts, Quicknotes workspace blocks, Markdown Docs suite, and Retrospective Progress charts.*

### Sprint 6: Calendar Grid View & Target Filters

* **DoD:** Fully dynamic calendar rendering loop displaying project logs, task timelines, and custom event slots.
* **User Journey:** User toggles view configurations to instantly inspect monthly calendar workloads scoped to selected active project profiles.
* **Implementation Specs:**
* Construct non-blocking matrix layout tracking days across standard offsets.
* Apply reactive filters isolating items matching target active project keys.
* Incorporate rapid action event triggers directly inside day cell targets.


* **Testing Protocol:**
* *Vitest:* Validate accurate month matrix generation routines across leap years and day boundary structures.



### Sprint 7: Launchpad Portal Interface

* **DoD:** Grid layouts handling custom workspace link assets accompanied by quick link provisioning components.
* **User Journey:** User types destination addresses inside bar to instantaneously add or filter tiles out of grid sets.
* **Implementation Specs:**
* Construct Launchpad structural grids wrapping tiles into customizable template nodes.
* Build clean URL address lookup fields with real-time text parsing inputs.
* Integrate instant inline deletion triggers and tag organization selectors.


* **Testing Protocol:**
* *Playwright:* Test inputs text addition pipelines, ensuring proper creation parameters update localized models.



### Sprint 8: Quicknotes Mosaic Layout & Card Management

* **DoD:** Drag-and-drop structural boards processing flexible task list items and miscellaneous content blocks.
* **User Journey:** User updates short text blurbs or checks checkboxes smoothly within pinning zones.
* **Implementation Specs:**
* Write clean grid layout mapping pinned notes containers gracefully alongside standard lists.
* Implement interactive checklist event controllers that process atomic state updates directly inside IndexedDB records.


* **Testing Protocol:**
* *Vitest:* Ensure fast mutation sequences across nested block items do not execute overlapping, race-condition operations.



### Sprint 9: Markdown Workspace Workspace (Docs view)

* **DoD:** Dynamic splits providing standard editing mechanics coupled to fully styled document outputs.
* **User Journey:** User processes multi-tier formatting structures smoothly with accurate presentation outputs.
* **Implementation Specs:**
* Build secure parsing processors translating structural tokens into safe render layers.
* Integrate direct file compilation interfaces allowing standard markdown transport exports.


* **Testing Protocol:**
* *Vitest:* Confirm markdown translation handlers properly block execution vectors and preserve rich typography structures.



### Sprint 10: Retrospective Performance Framework (Progress view)

* **DoD:** Render analytical reporting structures mapping performance patterns across active operational parameters.
* **User Journey:** User measures total workload indicators across custom tracking periods securely without transmission leaks.
* **Implementation Specs:**
* Generate zero-dependency, low-latency SVG chart models rendering historical time tracks.
* Write analytical compilers parsing execution metrics across selected view parameters.


* **Testing Protocol:**
* *Vitest:* Test mathematical processing routines to make sure empty histories or outlier log durations don't crash components.



---

## Epic 4: Clerk Assistant Integration & Time Tracking

*Focus: Conversational command inputs engine, operational drafts parsing, and persistent background time recorders.*

### Sprint 11: Clerk Panel Input Processor & State Engines

* **DoD:** Input panels handling custom language control vectors accompanied by active context history stacks.
* **User Journey:** User directs requests into prompt controls to manipulate active tasks, document objects, or system records immediately.
* **Implementation Specs:**
* Design multi-state workspace inputs with mic tracking state toggles.
* Build target payload text parsers identifying commands and isolating target actions smoothly.


* **Testing Protocol:**
* *Playwright:* Track prompt generation processes, assuring standard history strings record to storage safely.



### Sprint 12: Live Task Time Recorders Engine

* **DoD:** Multi-tier execution layers tracking live operational records across active structural projects.
* **User Journey:** User presses active task play switches to instantiate background tracking counters across target timelines.
* **Implementation Specs:**
* Build thread-safe timestamp engines tracking active running objects accurately.
* Integrate non-blocking clock elements that update UI structures smoothly without incurring excessive re-renders.


* **Testing Protocol:**
* *Vitest:* Ensure long-running counters maintain timekeeping accuracy across mock system time dilation sequences.



---

## Epic 5: Advanced Controls, Backend & Reconciliation Sync Engine

*Focus: Configuration full-screen panels, multi-project context management, Rust parity API layer, and conflict resolution systems.*

### Sprint 13: Full-Screen Configuration Framework & Data Bridges

* **DoD:** Management overlay structures housing advanced configuration rules and file migration bridges.
* **User Journey:** User switches configuration toggles, sets custom API locations, or triggers database backup workflows.
* **Implementation Specs:**
* Build full-frame navigation containers with robust layout isolation.
* Integrate structured JSON transport modules formatting complete database parameters cleanly for export.


* **Testing Protocol:**
* *Playwright:* Validate form persistence pipelines across manual configuration cycles.



### Sprint 14: Multi-Project Scope Architectures

* **DoD:** Administrative overlays handling full structural project life cycles and visibility criteria parameters.
* **User Journey:** User modifies names, archives outdated folders, or cleans out inactive workspaces safely.
* **Implementation Specs:**
* Build context enforcement engines cascading deletion protocols safely across related objects.
* Integrate clear context recovery controls targeting isolated preservation layers.


* **Testing Protocol:**
* *Vitest:* Confirm cascading deletion constraints work properly without leaving unlinked orphan records in other tables.



### Sprint 15: Bidirectional Timestamp Sync Engine & API Parity

* **DoD:** Rust backend validation engine providing background reconciliation based strictly on atomic modifications tracking.
* **User Journey:** Network dropouts resolve reliably because local records synchronize seamlessly with remote nodes using the latest modification states.
* **Implementation Specs:**
* Build background comparison logic identifying target updates securely using strict tracking timestamps.
* Configure rust backend controllers to enforce storage operations matching internal layout rules precisely.


* **Testing Protocol:**
* *Rust Tests:* Verify that multi-source record updates evaluate conflict scenarios accurately, preserving the newest data modifications.

Got it, my apologies for jumping the gun! Now that I can see the full Settings modal hierarchy, including Integrations, Project Scope, Advanced Settings (Custom AI & API Endpoints), Keyboard Shortcuts, and the Trash system, the picture is complete.

This final batch reveals a sophisticated power-user configuration layer. The granular obfuscation sliders, custom LLM endpoint mapping for the Clerk, and the 30-day soft-delete lifecycle are excellent features, but they require strict architectural discipline to maintain your ultra-low latency and local-first requirements.

Here is the appended **Epic 6**, rounding out the complete roadmap to 20 highly focused Sprints for your coding agent.

---

## Epic 6: Advanced Configuration, Integrations & Lifecycle Management

*Focus: 3rd-party API ingestion (Calendar/LLMs), granular privacy controls, global hotkeys, and data retention lifecycles.*

### Sprint 16: Granular Privacy Obfuscation & Project Scope Engine

* **DoD:** Implementation of the continuous blur strength slider (XS to 2XL) and stateful toggles for default obfuscation/visibility across all 9 major app views.
* **User Journey:** The user adjusts a slider and watches the obfuscated text across the app dynamically shift in blur intensity. They can configure specific views (like Calendar or Launchpad) to ignore project isolation and show all data globally.
* **Implementation Specs:**
* Map the "Blur strength" slider to a global CSS custom property (e.g., `--blur-intensity`) injected dynamically into the `.obfuscate-some` and `.obfuscate-all` utility classes.
* Expand the IndexedDB `settings` table to store boolean maps for "App-wide visibility" (e.g., `calendar_shows_all_projects`, `sidebar_searches_all_projects`).
* Update the database query wrappers for each view to dynamically respect these cross-project visibility flags before filtering.


* **Testing Protocol:**
* *Playwright:* Validate that the CSS variable updates linearly with the slider and that blurred text passes visual occlusion thresholds. Verify that toggling cross-project visibility successfully retrieves unlinked data in the target views.



### Sprint 17: External Calendar Integrations (Google & ICS Feeds)

* **DoD:** Read-only ingestion pipeline for standard `.ics` URLs and an OAuth bridge for Google Calendar, securely routed through Tauri desktop or the configured Rust backend.
* **User Journey:** The user pastes a private iCal link or signs into Google, maps that specific calendar to "Default Project," and sees remote events instantly populate their local calendar grid alongside native tasks.
* **Implementation Specs:**
* Create an ICS parser utility in `src/lib/utils/` to translate remote events into the local IndexedDB schema, storing them with a specialized `source_type` flag to prevent local edits on read-only feeds.
* Implement Tauri secure system browser calls for OAuth flows to prevent CORS or standard browser iframe blocking during Google Authentication.
* Store API tokens securely (using Tauri's secure enclave plugins if on desktop, or encrypted IndexedDB strings on the web).


* **Testing Protocol:**
* *Vitest:* Feed the parser complex, multi-timezone `.ics` mock files to ensure deterministic, accurate timestamp parsing without mutating the standard local database structure.



### Sprint 18: Bring-Your-Own-Backend (BYOB) & Custom AI Hooks

* **DoD:** Implementation of the "Advanced Settings" panel connecting the custom Bearer token/Base URL cloud sync layer, plus the fully configurable Clerk AI payload system.
* **User Journey:** A privacy-conscious user overrides the default backend, pointing the app to their self-hosted instance, and enters their own OpenAI API key to power the Clerk without routing data through third parties.
* **Implementation Specs:**
* Bind the "Cloud Sync Settings" fields to the Axios/Fetch base configuration layer. Inject the `API Token` strictly as an `Authorization: Bearer <token>` header.
* Configure the Clerk AI request engine to construct prompts using the user-defined `AI Endpoint`, `AI Model`, `Max Tokens`, and `Transcription Model` variables.
* *Constraint Check:* The AI API Key must never be logged or transmitted anywhere except the explicit user-defined endpoint.


* **Testing Protocol:**
* *Vitest / Playwright:* Mock the API endpoint responses and verify that saving custom endpoints successfully redirects all subsequent Clerk API fetch calls to the new localhost/custom URL.



### Sprint 19: Global Keyboard Shortcuts & Accessibility Routing

* **DoD:** A background event listener matrix that triggers high-level application functions (modals, navigations, quick-adds) using standard modifier keys.
* **User Journey:** A power user presses `N + E` and instantly sees the "New Event" modal pop up, bypassing the mouse entirely.
* **Implementation Specs:**
* Build a global keydown listener mapped to a contextual shortcut registry (`src/lib/controls/shortcuts.ts`).
* Ensure inputs are suppressed if the user is actively typing inside an `input`, `textarea`, or contenteditable markdown block (unless combined with `Ctrl/Cmd`).


* **Testing Protocol:**
* *Playwright:* Simulate keyboard dispatch events (`Ctrl+K`, `N+E`) and assert that the correct DOM overlays/modals are rendered instantly.



### Sprint 20: Trash Lifecycle & Soft Deletion Data Management

* **DoD:** A robust soft-deletion system utilizing `deleted_at` timestamps, complete with a 30-day automated purge loop and a user-facing restoration interface.
* **User Journey:** A user accidentally deletes a Launchpad link, navigates to Settings > Trash, and clicks "Restore." The item immediately reappears in its original project.
* **Implementation Specs:**
* Update all primary IndexedDB `DELETE` mutations to instead execute an `UPDATE` that injects the current timestamp into the `deleted_at` column.
* Update all default local-first database queries to append `WHERE deleted_at IS NULL`.
* Build the Trash view to query *only* records where `deleted_at IS NOT NULL`, displaying their original schema types and calculating the time remaining until the 30-day purge.
* Implement an asynchronous boot-check function that hard-deletes records older than 30 days from IndexedDB (and pushes those destructive syncs to the Rust backend).


* **Testing Protocol:**
* *Vitest:* Write edge-case tests verifying that a soft-deleted record is entirely ignored by UI render loops, successfully restored upon command, and permanently dropped from the IndexedDB tables once the 30-day epoch threshold is crossed in simulated time.
