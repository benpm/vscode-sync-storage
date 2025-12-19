# Change Log

All notable changes to the "vscode-sync-storage" extension will be documented in this file.

## [0.1.0] - Initial Release

### Added
- Virtual file system provider for sync storage (`syncstore://` URI scheme)
- Command to open Sync Storage workspace
- Command to create new files in Sync Storage
- Command to clear all files from Sync Storage
- Automatic synchronization via VS Code Settings Sync
- Support for all standard file operations (create, read, write, delete, rename)
- Support for directory operations
- File persistence using VS Code's globalState
- Base64 serialization for efficient storage
