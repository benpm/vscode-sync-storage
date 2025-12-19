import * as vscode from 'vscode';

export interface SerializedFileEntry {
    type: vscode.FileType;
    ctime: number;
    mtime: number;
    size: number;
    data?: string; // base64 encoded
    entries?: { [key: string]: SerializedFileEntry };
}

export interface FileEntry {
    type: vscode.FileType;
    ctime: number;
    mtime: number;
    size: number;
    data?: Uint8Array;
    entries?: Map<string, FileEntry>;
}

export class SyncStorageFileSystemProvider implements vscode.FileSystemProvider {
    private root: FileEntry = {
        type: vscode.FileType.Directory,
        ctime: Date.now(),
        mtime: Date.now(),
        size: 0,
        entries: new Map()
    };

    private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

    constructor(private context: vscode.ExtensionContext) {
        // Enable syncing for the storage key
        this.context.globalState.setKeysForSync(['syncStorageFiles']);
        this.loadFromStorage();
    }

    watch(uri: vscode.Uri): vscode.Disposable {
        // Simplified implementation - immediate file system changes are tracked via _fireSoon
        // Advanced file watching (external changes, etc.) is not implemented
        return new vscode.Disposable(() => {});
    }

    stat(uri: vscode.Uri): vscode.FileStat {
        const entry = this._lookup(uri, false);
        return {
            type: entry.type,
            ctime: entry.ctime,
            mtime: entry.mtime,
            size: entry.size
        };
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        const entry = this._lookup(uri, false);
        if (entry.type !== vscode.FileType.Directory) {
            throw vscode.FileSystemError.FileNotADirectory(uri);
        }
        if (!entry.entries) {
            return [];
        }
        const result: [string, vscode.FileType][] = [];
        entry.entries.forEach((childEntry, name) => {
            result.push([name, childEntry.type]);
        });
        return result;
    }

    createDirectory(uri: vscode.Uri): void {
        const basename = this._basename(uri.path);
        const dirname = uri.with({ path: this._dirname(uri.path) });
        const parent = this._lookup(dirname, false);

        if (parent.type !== vscode.FileType.Directory) {
            throw vscode.FileSystemError.FileNotADirectory(dirname);
        }

        const entry: FileEntry = {
            type: vscode.FileType.Directory,
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            entries: new Map()
        };

        parent.entries!.set(basename, entry);
        parent.mtime = Date.now();
        this.saveToStorage();
        this._fireSoon({ type: vscode.FileChangeType.Created, uri });
    }

    readFile(uri: vscode.Uri): Uint8Array {
        const entry = this._lookup(uri, false);
        if (entry.type !== vscode.FileType.File) {
            throw vscode.FileSystemError.FileIsADirectory(uri);
        }
        return entry.data || new Uint8Array(0);
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): void {
        const basename = this._basename(uri.path);
        const parent = this._lookupParentDirectory(uri);
        let entry = parent.entries!.get(basename);

        if (entry && entry.type === vscode.FileType.Directory) {
            throw vscode.FileSystemError.FileIsADirectory(uri);
        }

        if (!entry && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        if (entry && options.create && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }

        if (!entry) {
            entry = {
                type: vscode.FileType.File,
                ctime: Date.now(),
                mtime: Date.now(),
                size: content.byteLength,
                data: content
            };
            parent.entries!.set(basename, entry);
            this._fireSoon({ type: vscode.FileChangeType.Created, uri });
        } else {
            entry.mtime = Date.now();
            entry.size = content.byteLength;
            entry.data = content;
            this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
        }

        parent.mtime = Date.now();
        this.saveToStorage();
    }

    delete(uri: vscode.Uri, options: { recursive: boolean }): void {
        const basename = this._basename(uri.path);
        const dirname = uri.with({ path: this._dirname(uri.path) });
        const parent = this._lookup(dirname, false);

        if (parent.type !== vscode.FileType.Directory) {
            throw vscode.FileSystemError.FileNotADirectory(dirname);
        }

        const entry = parent.entries!.get(basename);
        if (!entry) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }

        if (entry.type === vscode.FileType.Directory && !options.recursive) {
            if (entry.entries && entry.entries.size > 0) {
                throw vscode.FileSystemError.NoPermissions('Directory not empty');
            }
        }

        parent.entries!.delete(basename);
        parent.mtime = Date.now();
        this.saveToStorage();
        this._fireSoon({ type: vscode.FileChangeType.Deleted, uri });
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {
        if (!options.overwrite && this._lookup(newUri, true)) {
            throw vscode.FileSystemError.FileExists(newUri);
        }

        const entry = this._lookup(oldUri, false);
        const oldParent = this._lookupParentDirectory(oldUri);

        const newParent = this._lookupParentDirectory(newUri);
        const newName = this._basename(newUri.path);

        oldParent.entries!.delete(this._basename(oldUri.path));
        newParent.entries!.set(newName, entry);

        this.saveToStorage();
        this._fireSoon(
            { type: vscode.FileChangeType.Deleted, uri: oldUri },
            { type: vscode.FileChangeType.Created, uri: newUri }
        );
    }

    private _lookup(uri: vscode.Uri, silent: false): FileEntry;
    private _lookup(uri: vscode.Uri, silent: boolean): FileEntry | undefined;
    private _lookup(uri: vscode.Uri, silent: boolean): FileEntry | undefined {
        const parts = uri.path.split('/').filter(p => p.length > 0);
        let entry: FileEntry = this.root;

        for (const part of parts) {
            if (entry.type !== vscode.FileType.Directory || !entry.entries) {
                if (!silent) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                return undefined;
            }
            const child = entry.entries.get(part);
            if (!child) {
                if (!silent) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                return undefined;
            }
            entry = child;
        }

        return entry;
    }

    private _lookupParentDirectory(uri: vscode.Uri): FileEntry {
        const dirname = uri.with({ path: this._dirname(uri.path) });
        return this._lookup(dirname, false);
    }

    private _basename(path: string): string {
        const parts = path.split('/').filter(p => p.length > 0);
        return parts[parts.length - 1] || '';
    }

    private _dirname(path: string): string {
        const parts = path.split('/').filter(p => p.length > 0);
        parts.pop();
        return '/' + parts.join('/');
    }

    private _fireSoon(...events: vscode.FileChangeEvent[]): void {
        this._emitter.fire(events);
    }

    private saveToStorage(): void {
        const serialized = this.serializeFileSystem(this.root);
        this.context.globalState.update('syncStorageFiles', serialized);
    }

    private loadFromStorage(): void {
        const serialized = this.context.globalState.get<SerializedFileEntry>('syncStorageFiles');
        if (serialized) {
            this.root = this.deserializeFileSystem(serialized);
        }
    }

    private serializeFileSystem(entry: FileEntry): SerializedFileEntry {
        const result: SerializedFileEntry = {
            type: entry.type,
            ctime: entry.ctime,
            mtime: entry.mtime,
            size: entry.size
        };

        if (entry.type === vscode.FileType.File && entry.data) {
            // Convert Uint8Array to base64 string for storage
            result.data = Buffer.from(entry.data).toString('base64');
        }

        if (entry.type === vscode.FileType.Directory && entry.entries) {
            result.entries = {};
            entry.entries.forEach((childEntry, name) => {
                result.entries![name] = this.serializeFileSystem(childEntry);
            });
        }

        return result;
    }

    private deserializeFileSystem(serialized: SerializedFileEntry): FileEntry {
        const entry: FileEntry = {
            type: serialized.type,
            ctime: serialized.ctime,
            mtime: serialized.mtime,
            size: serialized.size
        };

        if (serialized.type === vscode.FileType.File && serialized.data) {
            // Convert base64 string back to Uint8Array
            entry.data = new Uint8Array(Buffer.from(serialized.data, 'base64'));
        }

        if (serialized.type === vscode.FileType.Directory && serialized.entries) {
            entry.entries = new Map();
            Object.keys(serialized.entries).forEach(name => {
                entry.entries!.set(name, this.deserializeFileSystem(serialized.entries![name]));
            });
        }

        return entry;
    }

    public clearAll(): void {
        this.root = {
            type: vscode.FileType.Directory,
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            entries: new Map()
        };
        this.saveToStorage();
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: vscode.Uri.parse('syncstore:/') });
    }
}
