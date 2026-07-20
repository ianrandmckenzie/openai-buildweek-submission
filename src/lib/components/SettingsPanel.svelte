<script lang="ts">
  import { closeSettings } from '../ui/settings';
  import {
    createDashboardExport,
    parseDashboardExport,
    serializeDashboardExport,
  } from '../settings/config';
  import { createDownloadAdapter } from '../utils/runtime';
  import ProjectsPanel from './ProjectsPanel.svelte';
  import PrivacySettings from './PrivacySettings.svelte';
  import BackendSettings from './BackendSettings.svelte';
  import CustomAISettings from './CustomAISettings.svelte';
  import { clerkAIConfig, saveClerkAIConfig, cloudSyncConfig, saveCloudSyncConfig } from '../clerk/ai-config';
  type SettingsTab = 'general' | 'projects' | 'screen-privacy' | 'backend' | 'advanced';
  export let initialTab: SettingsTab = 'general';
  const settingsTabs: SettingsTab[] = ['general', 'projects', 'screen-privacy', 'backend', 'advanced'];
  let activeTab: SettingsTab = settingsTabs.includes(initialTab) ? initialTab : 'general';
  $: if (!settingsTabs.includes(initialTab)) activeTab = 'general';
  let message = '';
  let importText = '';
  function exportConfig(): void {
    const blob = new Blob(
      [serializeDashboardExport(createDashboardExport({ settings: [] }))],
      { type: 'application/json' }
    );
    createDownloadAdapter()
      .download(blob, 'kenzie-deskclerk-backup.json')
      .then(() => (message = 'Backup exported.'))
      .catch(() => (message = 'Export unavailable in this runtime.'));
  }
  function validateImport(): void {
    try {
      parseDashboardExport(importText);
      message = 'Backup format is valid and ready to import.';
    } catch (error) {
      message = error instanceof Error ? error.message : 'Invalid backup.';
    }
  }
</script>

<div class="settings-backdrop" role="presentation" on:click={closeSettings}>
  <section
    class="settings-panel"
    role="dialog"
    aria-modal="true"
    aria-label="Settings"
    on:click|stopPropagation
  >
    <header>
      <div>
        <p class="eyebrow">Workspace configuration</p>
        <h3>Settings</h3>
      </div>
      <button
        class="close-button"
        aria-label="Close settings"
        on:click={closeSettings}>×</button
      >
    </header>
    <nav class="settings-tabs" aria-label="Settings tabs">
      <button
        class:active={activeTab === 'general'}
        aria-selected={activeTab === 'general'}
        on:click={() => (activeTab = 'general')}>General</button
      ><button
        class:active={activeTab === 'projects'}
        aria-selected={activeTab === 'projects'}
        on:click={() => (activeTab = 'projects')}>Projects</button
      ><button
        class:active={activeTab === 'screen-privacy'}
        aria-selected={activeTab === 'screen-privacy'}
        on:click={() => (activeTab = 'screen-privacy')}>Screen Privacy</button
      ><button class:active={activeTab === 'advanced'} aria-selected={activeTab === 'advanced'} on:click={() => (activeTab = 'advanced')}>AI Settings</button
      ><button class:active={activeTab === 'backend'} aria-selected={activeTab === 'backend'} on:click={() => (activeTab = 'backend')}>Backend</button
      >
    </nav>
    <div class="settings-content">
      {#if activeTab === 'general'}<section class="settings-section">
          <h4>Data backup</h4>
          <p>
            Export a structured local backup or validate an existing dashboard
            file.
          </p>
          <button on:click={exportConfig}>Export backup</button><textarea
            aria-label="Import backup JSON"
            bind:value={importText}
            placeholder="Paste backup JSON here…"
          ></textarea><button class="secondary" on:click={validateImport}
            >Validate import</button
          >{#if message}<p class="status-message" role="status">
              {message}
            </p>{/if}
        </section>
        <section class="settings-section">
          <h4>Runtime</h4>
          <p class="muted">
            Local-first storage is active. Network sync and external endpoints
            will be configured in later sprints.
          </p>
        </section>{:else if activeTab === 'backend'}<BackendSettings />{:else if activeTab === 'projects'}<ProjectsPanel />{:else if activeTab === 'screen-privacy'}<PrivacySettings />{:else if activeTab === 'advanced'}<CustomAISettings showCloud={false} cloud={$cloudSyncConfig} ai={$clerkAIConfig} onChange={(cloud, ai) => { saveCloudSyncConfig(cloud); saveClerkAIConfig(ai); message = 'AI settings saved.'; }} />{/if}
      </div>
  </section>
</div>

<style>
  .settings-backdrop {
    position: fixed;
    z-index: 10;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgb(0 0 0 / 0.45);
  }
  .settings-panel {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    width: min(48rem, 100%);
    max-height: min(42rem, 100%);
    overflow: hidden;
    border: 1px solid var(--border-custom);
    border-radius: 0.8rem;
    background: var(--bg-primary);
    color: var(--text-main);
    box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.3);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 1.4rem;
    border-bottom: 1px solid var(--border-custom);
  }
  .eyebrow {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  h3 {
    margin: 0.2rem 0 0;
  }
  .close-button,
  button {
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.4rem;
    background: var(--accent-primary);
    color: var(--text-inverse);
    cursor: pointer;
  }
  .close-button {
    padding: 0.2rem 0.5rem;
    border: 0;
    background: transparent;
    color: var(--text-main);
    font-size: 1.2rem;
  }
  .settings-tabs {
    display: flex;
    gap: 0.2rem;
    padding: 0 1.4rem;
    border-bottom: 1px solid var(--border-custom);
  }
  .settings-tabs button {
    border: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    background: transparent;
    color: var(--text-muted);
  }
  .settings-tabs button.active {
    border-color: var(--text-main);
    color: var(--text-main);
    font-weight: 700;
  }
  .settings-content {
    overflow: auto;
    padding: 1.4rem;
  }
  .settings-section {
    display: grid;
    gap: 0.65rem;
    padding: 0 0 1.5rem;
  }
  .settings-section + .settings-section {
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-custom);
  }
  h4 {
    margin: 0;
  }
  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.5;
  }
  textarea {
    min-height: 8rem;
    resize: vertical;
    padding: 0.7rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.4rem;
    background: var(--bg-secondary);
    color: var(--text-main);
    font:
      0.75rem/1.4 ui-monospace,
      monospace;
  }
  .secondary {
    background: var(--bg-elevated);
    color: var(--text-main);
  }
  .status-message {
    color: var(--text-main);
  }
  .muted {
    opacity: 0.8;
  }
</style>
