"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const path = require("path");
const vscode_languageclient_1 = require("vscode-languageclient");
function activate(context) {
    const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: { execArgv: ["--nolazy", "--inspect=6009"] },
        },
    };
    const clientOptions = {
        documentSelector: [
            { scheme: "file", language: "html" },
            { scheme: "file", language: "css" },
        ],
    };
    const client = new vscode_languageclient_1.LanguageClient("cssClassIntellisense", "CSS Class Intellisense", serverOptions, clientOptions);
    context.subscriptions.push(client.start());
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map