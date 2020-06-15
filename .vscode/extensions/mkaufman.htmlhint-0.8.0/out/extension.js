"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
function activate(context) {
    // We need to go one level up since an extension compile the js code into
    // the output folder.
    let serverModulePath = path.join(__dirname, '..', 'server', 'server.js');
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6010"], cwd: process.cwd() };
    let serverOptions = {
        run: { module: serverModulePath },
        debug: { module: serverModulePath, options: debugOptions }
    };
    // Get file types to lint from user settings
    let config = vscode_1.workspace.getConfiguration('htmlhint');
    let languages = config.get('documentSelector');
    let documentSelector = languages.map(language => ({ language, scheme: 'file' }));
    // Set options
    let clientOptions = {
        documentSelector,
        diagnosticCollectionName: 'htmlhint',
        synchronize: {
            configurationSection: 'htmlhint',
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.htmlhintrc')
        }
    };
    let forceDebug = false;
    let client = new vscode_languageclient_1.LanguageClient('HTML-hint', serverOptions, clientOptions, forceDebug);
    context.subscriptions.push(new vscode_languageclient_1.SettingMonitor(client, 'htmlhint.enable').start());
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map