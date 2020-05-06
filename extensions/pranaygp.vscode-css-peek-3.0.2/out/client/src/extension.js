"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const supportedStyleLanguages = ['css', 'scss', 'less'];
let defaultClient;
let clients = new Map();
let _sortedWorkspaceFolders;
function sortedWorkspaceFolders() {
    if (_sortedWorkspaceFolders === void 0) {
        _sortedWorkspaceFolders = vscode_1.workspace.workspaceFolders.map(folder => {
            let result = folder.uri.toString();
            if (result.charAt(result.length - 1) !== '/') {
                result = result + '/';
            }
            return result;
        }).sort((a, b) => {
            return a.length - b.length;
        });
    }
    return _sortedWorkspaceFolders;
}
vscode_1.workspace.onDidChangeWorkspaceFolders(() => _sortedWorkspaceFolders = undefined);
function getOuterMostWorkspaceFolder(folder) {
    let sorted = sortedWorkspaceFolders();
    for (let element of sorted) {
        let uri = folder.uri.toString();
        if (uri.charAt(uri.length - 1) !== '/') {
            uri = uri + '/';
        }
        if (uri.startsWith(element)) {
            return vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(element));
        }
    }
    return folder;
}
function activate(context) {
    const config = vscode_1.workspace.getConfiguration('css_peek');
    const peekFromLanguages = config.get('peekFromLanguages');
    const peekToInclude = supportedStyleLanguages.map((l) => `**/*.${l}`);
    const peekToExclude = config.get('peekToExclude');
    let module = context.asAbsolutePath(path.join('server', 'server.js'));
    let outputChannel = vscode_1.window.createOutputChannel('css-peek');
    function didOpenTextDocument(document) {
        if (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled') {
            return;
        }
        let uri = document.uri;
        // Untitled files go to a default client.
        if (uri.scheme === 'untitled' && !defaultClient) {
            let debugOptions = { execArgv: ["--nolazy", "--inspect=6010"] };
            let serverOptions = {
                run: { module, transport: vscode_languageclient_1.TransportKind.ipc },
                debug: { module, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
            };
            let clientOptions = {
                documentSelector: peekFromLanguages
                    .map(language => ({
                    scheme: 'untitled',
                    language
                })),
                synchronize: {
                    configurationSection: 'css_peek'
                },
                initializationOptions: {
                    stylesheets: [],
                    peekFromLanguages: peekFromLanguages
                },
                diagnosticCollectionName: 'css-peek',
                outputChannel
            };
            defaultClient = new vscode_languageclient_1.LanguageClient('css-peek', 'CSS Peek', serverOptions, clientOptions);
            defaultClient.registerProposedFeatures();
            defaultClient.start();
            return;
        }
        let folder = vscode_1.workspace.getWorkspaceFolder(uri);
        // Files outside a folder can't be handled. This might depend on the language.
        // Single file languages like JSON might handle files outside the workspace folders.
        if (!folder) {
            return;
        }
        // If we have nested workspace folders we only start a server on the outer most workspace folder.
        folder = getOuterMostWorkspaceFolder(folder);
        if (!clients.has(folder.uri.toString())) {
            vscode_1.workspace.findFiles(`{${(peekToInclude || []).join(',')}}`, `{${(peekToExclude || []).join(',')}}`)
                .then(file_searches => {
                let potentialFiles = file_searches.filter((uri) => uri.scheme === 'file');
                let debugOptions = { execArgv: ["--nolazy", `--inspect=${6011 + clients.size}`] };
                let serverOptions = {
                    run: { module, transport: vscode_languageclient_1.TransportKind.ipc },
                    debug: { module, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
                };
                let clientOptions = {
                    documentSelector: peekFromLanguages
                        .map(language => ({
                        scheme: 'file',
                        language: language,
                        pattern: `${folder.uri.fsPath}/**/*`
                    })),
                    diagnosticCollectionName: 'css-peek',
                    synchronize: {
                        configurationSection: 'css_peek'
                    },
                    initializationOptions: {
                        stylesheets: potentialFiles.map(u => ({ uri: u.toString(), fsPath: u.fsPath })),
                        peekFromLanguages: peekFromLanguages
                    },
                    workspaceFolder: folder,
                    outputChannel
                };
                let client = new vscode_languageclient_1.LanguageClient('css-peek', 'CSS Peek', serverOptions, clientOptions);
                client.registerProposedFeatures();
                client.start();
                clients.set(folder.uri.toString(), client);
            });
        }
    }
    vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
    vscode_1.workspace.textDocuments.forEach(didOpenTextDocument);
    vscode_1.workspace.onDidChangeWorkspaceFolders((event) => {
        for (let folder of event.removed) {
            let client = clients.get(folder.uri.toString());
            if (client) {
                clients.delete(folder.uri.toString());
                client.stop();
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
    let promises = [];
    if (defaultClient) {
        promises.push(defaultClient.stop());
    }
    for (let client of clients.values()) {
        promises.push(client.stop());
    }
    return Promise.all(promises).then(() => undefined);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map