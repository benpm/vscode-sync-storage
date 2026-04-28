# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run compile      # Compile TypeScript to out/
npm run watch        # Watch mode for development
npm run lint         # ESLint on src/
npm run package      # Build .vsix for distribution (requires @vscode/vsce)
```

There are no automated tests — the extension must be validated by running it in VS Code via the Extension Development Host (F5 in VS Code with the launch config in `.vscode/launch.json`).

## Architecture

Two source files:

- **`src/extension.ts`** — Activation entry point. Registers the `syncstore://` FileSystemProvider and three commands: `syncStorage.openWorkspace`, `syncStorage.newFile`, `syncStorage.clearStorage`.
- **`src/fileSystemProvider.ts`** — Implements `vscode.FileSystemProvider` for the `syncstore://` URI scheme. Maintains an in-memory tree (`FileEntry`, backed by `Map<string, FileEntry>`) rooted at `this.root`. On every write/delete/rename/createDirectory, it serializes the full tree to `globalState` under the key `syncStorageFiles` and calls `setKeysForSync(['syncStorageFiles'])` so VS Code Settings Sync picks it up.

**Serialization**: The in-memory tree uses `Uint8Array` for file data and `Map` for directory children. The serialized form (`SerializedFileEntry`) uses base64 strings for data and plain objects for children, stored as JSON in `globalState`.

**Storage key**: `syncStorageFiles` — changing this key breaks sync for existing users.

**URI scheme**: `syncstore:///` is the workspace root. Paths are parsed by splitting on `/` and filtering empty segments.

## Key constraints

- No test infrastructure exists — validate by running in Extension Development Host.
- The extension activates on `onFileSystem:syncstore`, so it only loads when a `syncstore://` URI is accessed.
- `watch()` is a no-op stub; external file change detection (e.g. cross-device sync arriving mid-session) is not implemented.
- TypeScript target is ES2020, strict mode enabled, compiled to CommonJS in `out/`.
