"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const os = require("os");
/**
 * Settings for history.
 */
class HistorySettings {
    constructor() {
        this.settings = [];
    }
    static getTreeLocation() {
        let config = vscode.workspace.getConfiguration('local-history');
        return config.get('treeLocation');
    }
    get(file) {
        // Find workspaceFolder corresponding to file
        let folder;
        // const wsFolder = vscode.workspace.getWorkspaceFolder(file);
        // temporary code to resolve bug https://github.com/Microsoft/vscode/issues/36221
        const wsFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(file.fsPath));
        if (wsFolder)
            folder = wsFolder.uri;
        /*
        let folder = vscode.workspace.rootPath ? vscode.Uri.file(vscode.workspace.rootPath) : undefined;
        if (folder) {
            // if file is not a child of workspace => undefined
            const relativeFile = vscode.workspace.asRelativePath(file.fsPath);
            if (relativeFile === file.fsPath.replace(/\\/g, '/'))
                folder = undefined;
        }
        */
        let settings = this.settings.find((value, index, obj) => {
            if (folder && value.folder)
                return (value.folder.fsPath === folder.fsPath);
            else
                return (folder === value.folder);
        });
        if (!settings) {
            settings = this.read(folder, file, wsFolder);
            this.settings.push(settings);
        }
        return settings;
    }
    clear() {
        this.settings = [];
    }
    /*
    historyPath
       absolute
         saved in historyPath\.history\<absolute>
       not absolute
         saved in historyPath\.history\vscode.getworkspacefolder.basename\<relative>
         (no workspacefolder like absolute if always)
    no historyPath
       saved in vscode.getworkspacefolder\.history\<relative>
       (no workspacefolder => not saved)
    */
    read(workspacefolder, file, ws) {
        // for now no ressource configurations
        // let config = vscode.workspace.getConfiguration('local-history', file),
        let config = vscode.workspace.getConfiguration('local-history'), enabled = config.get('enabled'), exclude = config.get('exclude'), historyPath, absolute, message = '';
        if (typeof enabled === 'boolean')
            message += 'local-history.enabled must be a number, ';
        if (typeof exclude === 'string')
            message += 'local-history.exclude must be an array, ';
        if (message)
            vscode.window.showWarningMessage(`Change setting: ${message.slice(0, -2)}`, {}, { title: 'Settings', isCloseAffordance: false, id: 0 })
                .then((action) => {
                if (action && action.id === 0)
                    vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            });
        if (enabled !== 0 /* Never */) {
            historyPath = config.get('path');
            if (historyPath) {
                historyPath = historyPath
                    // replace variables like %AppData%
                    .replace(/%([^%]+)%/g, (_, key) => process.env[key])
                    // supports character ~ for homedir
                    .replace(/^~/, os.homedir());
                // start with
                // ${workspaceFolder} => current workspace
                // ${workspaceFolder: name} => workspace find by name
                // ${workspaceFolder: index} => workspace find by index
                const match = historyPath.match(/\${workspaceFolder(?:\s*:\s*(.*))?}/i);
                let historyWS;
                if (match) {
                    if (match.index > 1) {
                        vscode.window.showErrorMessage(`\${workspaceFolder} must starts settings local-history.path ${historyPath}`);
                    }
                    else {
                        const wsId = match[1];
                        if (wsId) {
                            const find = vscode.workspace.workspaceFolders.find(wsf => Number.isInteger(wsId - 1) ? wsf.index === Number.parseInt(wsId, 10) : wsf.name === wsId);
                            if (find)
                                historyWS = find.uri;
                            else
                                vscode.window.showErrorMessage(`workspaceFolder not found ${historyPath}`);
                        }
                        else
                            historyWS = workspacefolder;
                    }
                    if (historyWS)
                        historyPath = historyPath.replace(match[0], historyWS.fsPath);
                    else
                        historyPath = null;
                }
                if (historyPath) {
                    absolute = config.get('absolute');
                    if (absolute || (!workspacefolder && enabled === 1 /* Always */)) {
                        absolute = true;
                        historyPath = path.join(historyPath, '.history');
                    }
                    else if (workspacefolder) {
                        historyPath = path.join(historyPath, '.history', (historyWS && this.pathIsInside(workspacefolder.fsPath, historyWS.fsPath) ? '' : path.basename(workspacefolder.fsPath)));
                    }
                }
            }
            else if (workspacefolder) {
                // Save only files in workspace
                absolute = false;
                historyPath = path.join(workspacefolder.fsPath, '.history');
            }
        }
        if (historyPath)
            historyPath = historyPath.replace(/\//g, path.sep);
        return {
            folder: workspacefolder,
            daysLimit: config.get('daysLimit') || 30,
            saveDelay: config.get('saveDelay') || 0,
            maxDisplay: config.get('maxDisplay') || 10,
            dateLocale: config.get('dateLocale') || undefined,
            exclude: config.get('exclude') || ['**/.history/**', '**/.vscode/**', '**/node_modules/**', '**/typings/**', '**/out/**'],
            enabled: historyPath != null && historyPath !== '',
            historyPath: historyPath,
            absolute: absolute
        };
    }
    pathIsInside(test, parent) {
        return require('is-path-inside')(test, parent);
    }
}
exports.HistorySettings = HistorySettings;
//# sourceMappingURL=history.settings.js.map