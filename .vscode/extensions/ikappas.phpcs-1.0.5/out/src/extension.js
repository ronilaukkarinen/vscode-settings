/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const proto = require("./protocol");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const status_1 = require("./status");
const configuration_1 = require("./configuration");
function activate(context) {
    let client;
    let config;
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join("server", "src", "server.js"));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6199"] };
    // If the extension is launch in debug mode the debug server options are use
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    let middleware = {
        workspace: {
            configuration: (params, token, next) => __awaiter(this, void 0, void 0, function* () {
                return config.compute(params, token, next);
            })
        }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for php documents
        documentSelector: ["php"],
        synchronize: {
            // Notify the server about file changes to 'ruleset.xml' files contain in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/ruleset.xml")
        },
        middleware: middleware
    };
    // Create the language client.
    client = new vscode_languageclient_1.LanguageClient("phpcs", "PHP Code Sniffer", serverOptions, clientOptions);
    // Register new proposed protocol if available.
    client.registerProposedFeatures();
    config = new configuration_1.PhpcsConfiguration(client);
    // Create the status monitor.
    let status = new status_1.PhpcsStatus();
    client.onReady().then(() => {
        config.initialize();
        client.onNotification(proto.DidStartValidateTextDocumentNotification.type, event => {
            status.startProcessing(event.textDocument.uri);
        });
        client.onNotification(proto.DidEndValidateTextDocumentNotification.type, event => {
            status.endProcessing(event.textDocument.uri);
        });
    });
    client.start();
    // Push the monitor to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(status);
    context.subscriptions.push(config);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map