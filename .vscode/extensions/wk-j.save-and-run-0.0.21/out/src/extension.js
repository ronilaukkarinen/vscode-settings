"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const executor_1 = require("./executor");
const runner_1 = require("./runner");
function activate(context) {
    let extension = new runner_1.RunOnSaveExtension(context);
    extension.showOutputMessage();
    if ("onDidCloseTerminal" in vscode.window) {
        vscode.window.onDidCloseTerminal((terminal) => {
            executor_1.Executor.onDidCloseTerminal(terminal);
        });
    }
    vscode.workspace.onDidChangeConfiguration(() => {
        let disposeStatus = extension.showStatusMessage("Run On Save: Reloading config.");
        disposeStatus.dispose();
    });
    vscode.commands.registerCommand("extension.saveAndRun.enable", () => {
        extension.isEnabled = true;
    });
    vscode.commands.registerCommand("extension.saveAndRun.disable", () => {
        extension.isEnabled = false;
    });
    vscode.commands.registerCommand("extension.saveAndRun.execute", () => {
        let doc = vscode.window.activeTextEditor.document;
        doc.save();
        extension.runCommands(doc, true);
    });
    vscode.workspace.onDidSaveTextDocument((document) => {
        extension.runCommands(document, false);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map