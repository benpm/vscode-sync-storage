![](icon.png)

# VS Code Sync Storage

[![Build](https://img.shields.io/github/actions/workflow/status/benpm/vscode-sync-storage/package.yml?branch=main&label=build)](https://github.com/benpm/vscode-sync-storage/actions/workflows/package.yml)
[![Publish](https://img.shields.io/github/actions/workflow/status/benpm/vscode-sync-storage/publish.yml?label=publish)](https://github.com/benpm/vscode-sync-storage/actions/workflows/publish.yml)
[![Version](https://img.shields.io/visual-studio-marketplace/v/benpm.vscode-sync-storage)](https://marketplace.visualstudio.com/items?itemName=benpm.vscode-sync-storage)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/benpm.vscode-sync-storage)](https://marketplace.visualstudio.com/items?itemName=benpm.vscode-sync-storage)

A VS Code extension that allows you to store and sync arbitrary files across your VS Code instances using the built-in Settings Sync feature.

## Features

- **Virtual Workspace**: Open a special workspace that stores files in the extension's internal storage
- **Automatic Sync**: All files are automatically synced across your VS Code instances via Settings Sync
- **Simple File Operations**: Create, edit, delete, and organize files just like a normal workspace
- **Persistent Storage**: Files are stored in VS Code's global state and persist across sessions

## Usage

### Opening the Sync Storage Workspace

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Open Sync Storage Workspace" and select the command
3. Your Sync Storage workspace will open

### Creating Files

**Option 1: Using the Command**
1. Open the Command Palette
2. Type "Sync Storage: New File"
3. Enter the filename when prompted

**Option 2: Using the Explorer**disc
1. Right-click in the Explorer when in the Sync Storage workspace
2. Select "New File" from the context menu
3. Enter the filename

### Managing Files

- **Edit files**: Just open and edit them like normal files
- **Delete files**: Right-click and select "Delete" or use the Delete key
- **Create folders**: Right-click and select "New Folder"
- **Clear all files**: Run "Sync Storage: Clear All Files" from the Command Palette

## How It Works

The extension creates a virtual file system using the `syncstore://` URI scheme. All files are:
- Stored in VS Code's `globalState` storage
- Serialized to base64 strings for efficient storage
- Marked for sync using `setKeysForSync()` to enable cross-device synchronization
- Automatically synced when you have Settings Sync enabled in VS Code

### Architecture

```
┌─────────────────────────────────────────┐
│        VS Code Editor                   │
│  ┌───────────────────────────────────┐  │
│  │  Sync Storage Workspace           │  │
│  │  (syncstore:// URI scheme)        │  │
│  └───────────────────────────────────┘  │
│              ↓                          │
│  ┌───────────────────────────────────┐  │
│  │  FileSystemProvider               │  │
│  │  (Handles file operations)        │  │
│  └───────────────────────────────────┘  │
│              ↓                          │
│  ┌───────────────────────────────────┐  │
│  │  globalState Storage              │  │
│  │  (Base64 serialized files)        │  │
│  │  ← setKeysForSync(['files'])      │  │
│  └───────────────────────────────────┘  │
│              ↓                          │
│  ┌───────────────────────────────────┐  │
│  │  VS Code Settings Sync            │  │
│  │  (Syncs across devices)           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Requirements

- VS Code 1.85.0 or higher
- Settings Sync enabled in VS Code for cross-device synchronization

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package the extension
npm run package
```

### Installation

1. Build the extension using `npm run package`
2. Install the `.vsix` file in VS Code using "Extensions: Install from VSIX"

## License

MIT
