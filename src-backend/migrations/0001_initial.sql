CREATE TABLE IF NOT EXISTS records (store TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, synced_at INTEGER, PRIMARY KEY(store,id));
CREATE INDEX IF NOT EXISTS records_updated ON records(updated_at);
CREATE INDEX IF NOT EXISTS records_deleted ON records(deleted_at);
CREATE TABLE IF NOT EXISTS devices (id TEXT PRIMARY KEY, name TEXT NOT NULL, platform TEXT, app_version TEXT, token_hash TEXT NOT NULL, created_at INTEGER NOT NULL, last_seen_at INTEGER, revoked_at INTEGER);
CREATE INDEX IF NOT EXISTS devices_status ON devices(revoked_at,last_seen_at);
CREATE TABLE IF NOT EXISTS changes (cursor INTEGER PRIMARY KEY AUTOINCREMENT, store TEXT NOT NULL, record_id TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS changes_cursor ON changes(cursor);
CREATE TABLE IF NOT EXISTS pairing_requests (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, expires_at INTEGER NOT NULL, used_at INTEGER);
CREATE INDEX IF NOT EXISTS pairing_requests_expiry ON pairing_requests(expires_at,used_at);
