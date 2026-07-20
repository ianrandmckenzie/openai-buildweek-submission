import { mount } from 'svelte';
import App from './App.svelte';
import { startBackendSync } from './lib/sync/backend-sync';

startBackendSync();
mount(App, { target: document.getElementById('app')! });
