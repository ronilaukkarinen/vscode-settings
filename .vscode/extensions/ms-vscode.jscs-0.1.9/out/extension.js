"use strict";
var path = require('path');
var vscode_1 = require('vscode');
var vscode_languageclient_1 = require('vscode-languageclient');
function activate(context) {
    // We need to go one level up since an extension compile the js code into
    // the output folder.
    var serverModule = path.join(__dirname, '..', 'server', 'server.js');
    // TIP! change --debug to --debug-brk to debug initialization code in the server
    // F5 the extension and then F5 (Attach) the server instance
    var debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
    var serverOptions = {
        run: { module: serverModule },
        debug: { module: serverModule, options: debugOptions }
    };
    var clientOptions = {
        documentSelector: ['javascript', 'javascriptreact'],
        synchronize: {
            configurationSection: 'jscs',
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.jscsrc')
        }
    };
    var client = new vscode_languageclient_1.LanguageClient('JSCS', serverOptions, clientOptions);
    context.subscriptions.push(new vscode_languageclient_1.SettingMonitor(client, 'jscs.enable').start());
    // commands.registerCommand('jscs.fixFile', () => {
    // 	client.sendRequest(MyCommandRequest.type, { command: "jscs-quickfix"}).then((result) => {
    // 		window.showInformationMessage(result.message);
    // 	});
    // });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map