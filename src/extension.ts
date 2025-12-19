import * as vscode from 'vscode';
import { SyncStorageFileSystemProvider } from './fileSystemProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Sync Storage extension is now active');

    // Register the file system provider
    const fileSystemProvider = new SyncStorageFileSystemProvider(context);
    context.subscriptions.push(
        vscode.workspace.registerFileSystemProvider('syncstore', fileSystemProvider, {
            isCaseSensitive: true
        })
    );

    // Register command to open the sync storage workspace
    context.subscriptions.push(
        vscode.commands.registerCommand('syncStorage.openWorkspace', async () => {
            const workspaceUri = vscode.Uri.parse('syncstore:/');
            
            // Check if we're already in a workspace
            const currentWorkspace = vscode.workspace.workspaceFolders?.[0];
            if (currentWorkspace?.uri.scheme === 'syncstore') {
                vscode.window.showInformationMessage('You are already in the Sync Storage workspace');
                return;
            }

            // Open the sync storage workspace
            await vscode.commands.executeCommand('vscode.openFolder', workspaceUri, {
                forceNewWindow: false
            });

            vscode.window.showInformationMessage('Sync Storage workspace opened! Files here will sync across your VS Code instances.');
        })
    );

    // Register command to create a new file in sync storage
    context.subscriptions.push(
        vscode.commands.registerCommand('syncStorage.newFile', async () => {
            const fileName = await vscode.window.showInputBox({
                prompt: 'Enter the name for the new file',
                placeHolder: 'example.txt'
            });

            if (!fileName) {
                return;
            }

            const fileUri = vscode.Uri.parse(`syncstore:/${fileName}`);
            
            try {
                // Create an empty file
                await vscode.workspace.fs.writeFile(fileUri, new Uint8Array(0));
                
                // Open the file in the editor
                const document = await vscode.workspace.openTextDocument(fileUri);
                await vscode.window.showTextDocument(document);
                
                vscode.window.showInformationMessage(`Created ${fileName} in Sync Storage`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to create file: ${error}`);
            }
        })
    );

    // Register command to clear all sync storage
    context.subscriptions.push(
        vscode.commands.registerCommand('syncStorage.clearStorage', async () => {
            const confirm = await vscode.window.showWarningMessage(
                'Are you sure you want to clear all files from Sync Storage? This cannot be undone.',
                { modal: true },
                'Yes, Clear All'
            );

            if (confirm === 'Yes, Clear All') {
                fileSystemProvider.clearAll();
                vscode.window.showInformationMessage('Sync Storage cleared');
            }
        })
    );
}

export function deactivate() {}
