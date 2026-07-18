export type StoreName =
  | 'projects'
  | 'notes'
  | 'tasks'
  | 'documents'
  | 'time_logs'
  | 'launchpad_links'
  | 'settings';

export interface Metadata {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  synced_at: number | null;
}

export interface Project extends Metadata { name: string; color?: string; }
export interface Note extends Metadata { project_id: string; title: string; content: string; content_encrypted?: EncryptedEnvelope; }
export interface Task extends Metadata { project_id: string; title: string; completed: boolean; notes?: string; notes_encrypted?: EncryptedEnvelope; }
export interface Document extends Metadata { project_id: string; title: string; content: string; content_encrypted?: EncryptedEnvelope; }
export interface TimeLog extends Metadata { project_id: string; task_id?: string; started_at: number; ended_at?: number; duration_seconds?: number; }
export interface LaunchpadLink extends Metadata { project_id: string; title: string; url: string; tags?: string[]; }
export interface Setting extends Metadata { key: string; value: unknown; }

export type RecordByStore = {
  projects: Project; notes: Note; tasks: Task; documents: Document;
  time_logs: TimeLog; launchpad_links: LaunchpadLink; settings: Setting;
};

export interface EncryptedEnvelope {
  version: 1;
  algorithm: 'AES-GCM';
  iv: string;
  ciphertext: string;
}
