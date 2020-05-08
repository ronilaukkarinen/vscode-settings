"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vs = require("vscode");
class PathConfiguration {
    constructor() {
        this.data = {};
    }
    update(fileUri) {
        var codeConfiguration = vs.workspace.getConfiguration('path-autocomplete', fileUri || null);
        this.data.withExtension = codeConfiguration.get('includeExtension');
        this.data.withExtensionOnImport = codeConfiguration.get('extensionOnImport');
        this.data.excludedItems = codeConfiguration.get('excludedItems');
        this.data.pathMappings = codeConfiguration.get('pathMappings');
        this.data.pathSeparators = codeConfiguration.get('pathSeparators');
        this.data.transformations = codeConfiguration.get('transformations');
        this.data.triggerOutsideStrings = codeConfiguration.get('triggerOutsideStrings');
        this.data.useBackslash = codeConfiguration.get('useBackslash');
        this.data.enableFolderTrailingSlash = codeConfiguration.get('enableFolderTrailingSlash');
        this.data.ignoredFilesPattern = codeConfiguration.get('ignoredFilesPattern');
        this.data.homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
        var workspaceRootFolder = vs.workspace.workspaceFolders ? vs.workspace.workspaceFolders[0] : null;
        var workspaceFolder = workspaceRootFolder;
        if (fileUri) {
            workspaceFolder = vs.workspace.getWorkspaceFolder(fileUri);
        }
        this.data.workspaceFolderPath = workspaceFolder && workspaceFolder.uri.fsPath;
        this.data.workspaceRootPath = workspaceRootFolder && workspaceRootFolder.uri.fsPath;
    }
}
exports.default = PathConfiguration;
//# sourceMappingURL=PathConfiguration.js.map