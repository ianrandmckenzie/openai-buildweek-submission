# Kenzie Dashboard - Project Summary

## Overview
Kenzie Dashboard is a highly customized, privacy-focused, cross-platform personal management suite. It is designed to run across Web, Android, iOS, Windows, macOS, and Linux, providing a comprehensive set of tools including calendar management, a launchpad for quick links, quicknotes, markdown documents, time logging, and progress tracking.

## Core Architecture
*   **Target Platforms:** Web (Svelte/Vite), Desktop & Mobile (Tauri wrappers).
*   **Storage Strategy:** Local-first using IndexedDB as the primary data store. Network connectivity is completely optional.
*   **Sync & Backend:** Optional backend (built in Rust) or user-configurable 3rd-party backend. Data reconciliation relies on timestamp-based resolution (the newest timestamp wins).
*   **UI/UX Framework:** Svelte, Vite, TailwindCSS.
*   **Theming & Customization:** 100% token-based CSS variables. No hardcoded styles allowed. Users have full control over system/light/dark modes and custom preset themes.

## Key Features & Capabilities
1.  **Multi-Pane Interface:** A Left Sidebar "Clerk" (chat/assistant) pane combined with a dynamic Main Pane supporting various views (Calendar, Launchpad, Quicknotes, Docs, Time Logs, Progress).
2.  **Granular Privacy & Obfuscation:** A robust "blurring" engine allows users to obfuscate text across the app via a ternary toggle (None, Some, All) and a customizable blur strength slider, protecting PII from visual shoulder-surfing.
3.  **Project Contexts:** Data is strictly siloed by custom projects. Users can toggle cross-project visibility for specific views (e.g., showing all calendar events or searching globally across all projects).
4.  **Local AI Assistant ("Clerk"):** An integrated chat interface for commanding the application and drafting notes. It supports Bring-Your-Own-Backend (BYOB) configurations where users input their own API endpoints and keys.
5.  **Soft-Deletion Lifecycle:** A Trash system handles soft-deletes (`deleted_at` timestamps) with a 30-day automated purge loop and easy manual restoration.
6.  **External Integrations:** Read-only iCal (.ics) subscriptions and Google Calendar sync capabilities.
7.  **Power-User Navigation:** Comprehensive global keyboard shortcuts for instant actions (e.g., creating tasks, navigating views).

## Development Rules & Constraints (Agent Workflow)
*   **TDD Mandate:** Vitest, Playwright, and Rust tests MUST be written and pass before any feature code is implemented.
*   **Zero Build Operations:** `npm run build` is strictly prohibited to prevent breaking live browser testing.
*   **Security & Performance:** Treat all data as sensitive PII. Optimize for ultra-low latency, zero redundant renders, and 60 FPS performance, ensuring safety in non-browser Tauri environments.
*   **Icon Handling:** No inline SVGs or URLs. Missing icons must use an empty SVG and an `add-missing-icons.sh` script workflow.

## Project Epics Breakdown
1.  **Epic 1: Foundations, Local Storage & Theming Tokens** (IndexedDB schema, Token CSS variables, Tauri initialization).
2.  **Epic 2: Core Platform Shell & Globals Layout** (Split panes, Obfuscation engines, Global layout controls).
3.  **Epic 3: Main Views Construction** (Calendar grids, Launchpad, Markdown Docs, Analytics charts).
4.  **Epic 4: Clerk Assistant Integration & Time Tracking** (Chat interface, background timer hooks).
5.  **Epic 5: Advanced Controls, Backend & Reconciliation Sync Engine** (Rust sync parity, Multi-project administration).
6.  **Epic 6: Advanced Configuration, Integrations & Lifecycle Management** (Granular blurs, Google/iCal hooks, Trash view, Custom AI inputs, Hotkeys).
