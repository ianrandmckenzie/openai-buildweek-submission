<script lang="ts">
  import { onMount } from 'svelte';
  import { Storage } from '../storage/idb';
  import { createBackendClient } from '../integrations/backend';
  import CustomAISettings from './CustomAISettings.svelte';
  import { clerkAIConfig, saveClerkAIConfig, cloudSyncConfig, saveCloudSyncConfig } from '../clerk/ai-config';
  const storage = new Storage();
  let enabled = false, baseUrl = 'http://127.0.0.1:8787', deviceToken = '', deviceId = '', pairingCode = '', deviceName = 'My DeskClerk device', status = '', busy = false;
  async function load(){const settings=await storage.list('settings');const values=new Map(settings.map(s=>[s.key,s.value]));enabled=values.get('backend.enabled')===true;baseUrl=typeof values.get('backend.base_url')==='string'?values.get('backend.base_url') as string:baseUrl;deviceToken=typeof values.get('backend.device_token')==='string'?values.get('backend.device_token') as string:'';deviceId=typeof values.get('backend.device_id')==='string'?values.get('backend.device_id') as string:'';}
  async function save(key:string,value:unknown){const current=(await storage.list('settings')).find(s=>s.key===key);if(current) await storage.update('settings',{...current,value});else await storage.create('settings',{id:crypto.randomUUID(),key,value});}
  async function saveConfig(){await Promise.all([save('backend.enabled',enabled),save('backend.base_url',baseUrl.replace(/\/$/,'')),save('backend.device_token',deviceToken),save('backend.device_id',deviceId)]);if(typeof window!=='undefined')window.dispatchEvent(new Event('deskclerk:backend-config-changed'));status='Backend settings saved.';}
  async function checkHealth(){busy=true;try{await createBackendClient({enabled:true,baseUrl}).health();status='Backend is reachable.'}catch(e){status=e instanceof Error?e.message:'Backend is unavailable.'}finally{busy=false}}
  async function pair(){if(!pairingCode.trim()){status='Enter the pairing code from the backend admin page.';return}busy=true;try{const result=await createBackendClient({enabled:true,baseUrl}).pair({code:pairingCode,name:deviceName,platform:navigator.platform,app_version:'0.1.0'}) as {data?:{device_id:string,device_token:string}};deviceId=result.data?.device_id??'';deviceToken=result.data?.device_token??'';enabled=true;pairingCode='';await saveConfig();status='Device paired. The token is stored in IndexedDB and will not be shown again.'}catch(e){status=e instanceof Error?e.message:'Pairing failed.'}finally{busy=false}}
  onMount(load);
</script>
<section class="settings-section"><h4>Remote backend</h4><p>DeskClerk stays local-first. Connect an optional backend for device pairing and synchronization.</p><label>Backend URL<input bind:value={baseUrl} placeholder="http://127.0.0.1:8787" /></label><label class="check"><input type="checkbox" bind:checked={enabled} /> Enable remote persistence and sync</label><div class="actions"><button on:click={saveConfig}>Save settings</button><button class="secondary" on:click={checkHealth} disabled={busy}>Check connection</button></div></section>
<section class="settings-section"><h4>Pair this device</h4><p>Open the backend admin page, generate a pairing code, then enter it here.</p><label>Device name<input bind:value={deviceName} /></label><label>Pairing code<input bind:value={pairingCode} placeholder="8-character code" maxlength="8" /></label><button on:click={pair} disabled={busy}>Pair device</button>{#if deviceId}<p class="muted">Paired device: {deviceId}</p>{/if}</section>{#if status}<p class="status-message" role="status">{status}</p>{/if}
<CustomAISettings showCloud={true} showAI={false} cloud={$cloudSyncConfig} ai={$clerkAIConfig} onChange={(cloud) => { saveCloudSyncConfig(cloud); status = 'BYOB settings saved.'; }} />
<style>
  .settings-section { display:grid; gap:.65rem; padding:0 0 1.5rem; }
  .settings-section + .settings-section { padding-top:1.5rem; border-top:1px solid var(--border-custom); }
  h4 { margin:0; color:var(--text-main); font-size:1rem; }
  p { margin:0; color:var(--text-muted); font-size:.82rem; line-height:1.5; }
  label { display:grid; gap:.35rem; color:var(--text-muted); font-size:.78rem; }
  input:not([type=checkbox]) { width:100%; padding:.65rem .7rem; border:1px solid var(--border-custom); border-radius:.4rem; background:var(--bg-elevated); color:var(--text-main); font:inherit; }
  input:not([type=checkbox]):focus { outline:2px solid color-mix(in srgb, var(--accent-primary) 35%, transparent); outline-offset:1px; }
  .check { display:flex; align-items:center; gap:.5rem; color:var(--text-main); }
  .check input { width:1rem; height:1rem; accent-color:var(--accent-primary); }
  .actions { display:flex; flex-wrap:wrap; gap:.5rem; }
  button { width:fit-content; padding:.55rem .75rem; border:1px solid var(--border-custom); border-radius:.4rem; background:var(--accent-primary); color:var(--text-inverse); font:inherit; cursor:pointer; }
  button.secondary { background:var(--bg-elevated); color:var(--text-main); }
  button:disabled { opacity:.55; cursor:wait; }
  .status-message { color:var(--text-main); }
  .muted { color:var(--text-muted); }
  @media(max-width:600px){.actions{display:grid}.actions button{width:100%}}
</style>
