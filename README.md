# DeskClerk

DeskClerk is a local-first productivity workspace for tasks, events, notes, documents, links, routines, and time tracking. The optional Rust backend adds device pairing, persistence, synchronization, and a development tunnel.

## Judges

The fastest way to try the app is to use two terminals from the repository root:

```sh
# Terminal 1: start the local backend
cargo run --manifest-path src-backend/Cargo.toml

# Terminal 2: start the frontend
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). To load a ready-made workspace, run this while the frontend is running:

```sh
npm run seed:demo
```

Refresh the app after seeding. The script adds a Hackathon Demo project containing events, tasks, links, notes, a document, and a time log. It is safe to run again: records created by the seeder are replaced rather than duplicated.

To try backend sync:

1. Open Settings → Backend and enable remote persistence and sync.
2. Save settings and use Check connection.
3. Open the local backend admin page at [http://127.0.0.1:8787/admin](http://127.0.0.1:8787/admin).
4. In Devices, generate a pairing code.
5. Enter that code in Settings → Backend in the app and pair the device.
6. Click Sync in the app’s top navigation.
7. In the admin page, use Records to inspect the stored object types and Sync to inspect changes and cursors.

The browser remains the source of truth when offline. The backend is optional and receives records after local creation when sync is enabled. For a public connectivity demonstration, start a Quick Tunnel from the backend admin page; only public application and sync routes are exposed through it, while admin routes remain localhost-only.

## Development

```sh
npm test
npm run test:e2e
npm run build
```

The backend stores its development SQLite database at `src-backend/data/deskclerk.db`. See [src-backend/README.md](src-backend/README.md) for backend, tunnel, and native desktop development details.
