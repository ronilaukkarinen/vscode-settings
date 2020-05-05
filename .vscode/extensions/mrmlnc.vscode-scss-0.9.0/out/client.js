'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
function activate(context) {
    const serverModule = path.join(__dirname, 'server.js');
    const runExecArgv = [];
    const scssPort = vscode.workspace.getConfiguration().get('scss.dev.serverPort', -1);
    if (scssPort !== -1) {
        runExecArgv.push(`--inspect=${scssPort}`);
    }
    const debugOptions = {
        execArgv: ['--nolazy', '--inspect=6006']
    };
    const serverOptions = {
        run: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: { execArgv: runExecArgv }
        },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    const clientOptions = {
        documentSelector: ['scss', 'vue'],
        synchronize: {
            configurationSection: ['scss'],
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.scss')
        },
        initializationOptions: {
            settings: vscode.workspace.getConfiguration('scss')
        },
        // Don't open the output console (very annoying) in case of error
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never
    };
    const client = new vscode_languageclient_1.LanguageClient('scss-intellisense', 'SCSS IntelliSense', serverOptions, clientOptions);
    context.subscriptions.push(client.start());
    const promise = client.onReady().catch(e => {
        console.log('Client initialization failed');
        console.error(e);
    });
    return vscode.window.withProgress({
        title: 'SCSS IntelliSense initialization',
        location: vscode.ProgressLocation.Window
    }, () => promise);
}
exports.activate = activate;
//# sourceMappingURL=client.js.map