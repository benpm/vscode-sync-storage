# Examples and Use Cases

This document provides examples of how to use the VS Code Sync Storage extension.

## Basic Usage

### 1. Opening the Sync Storage Workspace

```
1. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
2. Type "Open Sync Storage Workspace"
3. Press Enter
```

Your workspace will now be using the virtual `syncstore://` file system.

### 2. Creating Your First File

**Method A: Using the Command Palette**
```
1. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
2. Type "Sync Storage: New File"
3. Enter filename: "notes.txt"
4. Start editing!
```

**Method B: Using the Explorer**
```
1. Right-click in the Explorer sidebar
2. Select "New File"
3. Enter filename: "notes.txt"
```

### 3. Organizing with Folders

```
1. Right-click in the Explorer
2. Select "New Folder"
3. Enter folder name: "projects"
4. Create files inside the folder normally
```

## Use Cases

### Personal Notes That Sync Everywhere

Keep personal notes that automatically sync across all your devices:

```
syncstore:/
  ├── daily-notes/
  │   ├── 2024-12-19.md
  │   └── todo.md
  ├── snippets/
  │   ├── bash-commands.sh
  │   └── sql-queries.sql
  └── quick-reference.md
```

### Configuration Templates

Store configuration templates that you use across different projects:

```
syncstore:/
  ├── configs/
  │   ├── .eslintrc.json
  │   ├── tsconfig.json
  │   └── docker-compose.yml
  └── templates/
      ├── README-template.md
      └── gitignore-node.txt
```

### Code Snippets Library

Maintain a personal library of code snippets:

```
syncstore:/
  ├── javascript/
  │   ├── array-utils.js
  │   └── async-patterns.js
  ├── python/
  │   ├── decorators.py
  │   └── data-processing.py
  └── sql/
      └── common-queries.sql
```

### Interview Prep

Keep interview questions and solutions synced:

```
syncstore:/
  ├── algorithms/
  │   ├── sorting.js
  │   └── graphs.js
  ├── system-design/
  │   └── notes.md
  └── behavioral/
      └── questions.md
```

## Tips and Tricks

### Tip 1: Quick Access
Add files you access frequently to your workspace's "Open Editors" by keeping them open.

### Tip 2: Search Across Files
Use VS Code's global search (Ctrl+Shift+F) to search across all your synced files.

### Tip 3: Clear Old Data
If you want to start fresh, use the command:
```
Ctrl+Shift+P → "Sync Storage: Clear All Files"
```

### Tip 4: Backup Important Files
While the extension syncs via Settings Sync, consider occasionally backing up critical files to your local file system.

### Tip 5: File Size Considerations
The extension stores files in VS Code's storage. For large files, consider using traditional file storage instead.

## Limitations

- Files are stored in VS Code's internal storage (limited by VS Code's globalState size limits)
- No external file watching (changes only detected through VS Code operations)
- Best suited for text files and small binary files
- Sync depends on VS Code Settings Sync being enabled and working

## Troubleshooting

### Files Not Syncing?
1. Check that Settings Sync is enabled in VS Code (Settings → Settings Sync)
2. Verify you're signed in with the same account on all devices
3. Force a sync: Ctrl+Shift+P → "Settings Sync: Sync Now"

### Can't Open Workspace?
1. Try closing VS Code and reopening
2. Check the extension is activated (it should activate automatically)
3. Check the Output panel for any error messages

### Lost Files?
Files are stored in VS Code's globalState. If Settings Sync is working, they should be recoverable by:
1. Signing in to your sync account
2. Waiting for sync to complete
3. Opening the Sync Storage workspace again
