# DeskClerk backend

Local-first, SQLite-backed Rust API for the DeskClerk stores. The frontend remains authoritative for offline use; this service is optional remote persistence.

## Local API development

```sh
cargo run --manifest-path src-backend/Cargo.toml
```

This starts the `deskclerk-backend` API on `http://127.0.0.1:8787`. The `default-run` setting intentionally selects the backend even though this package also contains the optional tunnel utility.

Development stores SQLite at `src-backend/data/deskclerk.db`, resolved from the backend directory so the command works from either the repository root or `src-backend/`. Override it with `DESKCLERK_DATABASE_URL` for production or another local data location. Other configuration: `DESKCLERK_BIND_ADDRESS` (default `127.0.0.1:8787`) and `DESKCLERK_LOG_LEVEL`.

All `/api/v1` routes require `Authorization: Bearer <device-token>`. Device records and pairing ceremonies should be provisioned by the future admin pairing flow before exposing the service remotely; authentication is intentionally fail-closed. CRUD routes are `/:store` and `/:store/:id` for the eight store names. Records use Unix milliseconds and soft deletion.

Sync uses version 1 envelopes and last-write-wins (`updated_at`, then record ID as deterministic tie-breaker). Tombstones are retained in SQLite. The tunnel is never an authentication boundary.

## Security and operations

Bind loopback by default, use HTTPS for public access, restrict CORS to the DeskClerk origin, protect the database file, and back it up before upgrades. The request body is capped at 2 MiB, logs are structured, and record content is never logged. Production pairing, admin sessions/CSRF, backup restore, and managed tunnel lifecycle are tracked as follow-up modules around this stable storage/API core.

## Tunnel options

### Packaged desktop app (recommended)

The backend owns tunnel lifecycle. Use the backend admin page at `/admin` to start or stop the tunnel and view its public URL. The Tauri desktop app may bundle platform-specific `cloudflared` binaries under `src-tauri/binaries/`, but the frontend does not launch the tunnel.

### Standalone development utility

With the backend running in one terminal, start a free temporary TryCloudflare tunnel in another:

```sh
cargo run --manifest-path src-backend/Cargo.toml --bin deskclerk-tunnel -- start
```

This utility is separate from the packaged app and requires `cloudflared` on your `PATH`. On macOS, install it with `brew install cloudflared`; alternatively set `CLOUDFLARED_BIN` to an executable path. It prints the generated `trycloudflare.com` URL. Stop it with `Ctrl-C`.

Quick Tunnels are for development/testing only. The tunnel URL is not authentication, so device pairing remains required.

### Common commands

```sh
# Start the backend (default binary)
cargo run --manifest-path src-backend/Cargo.toml

# Explicit equivalent
cargo run --manifest-path src-backend/Cargo.toml --bin deskclerk-backend

# Standalone tunnel, only when cloudflared is installed separately
cargo run --manifest-path src-backend/Cargo.toml --bin deskclerk-tunnel -- start

# Tauri desktop development
cargo tauri dev
```
