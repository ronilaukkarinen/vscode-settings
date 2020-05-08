"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Executor {
    static runInTerminal(command, terminal) {
        if (this.terminals[terminal] === undefined) {
            const term = vscode.window.createTerminal(terminal);
            this.terminals[terminal] = term;
        }
        if (command.silent !== true) {
            this.terminals[terminal].show();
        }
        this.terminals[terminal].sendText(command.cmd);
        setTimeout(() => {
            vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
        }, 100);
    }
    static onDidCloseTerminal(closedTerminal) {
        delete this.terminals[closedTerminal.name];
    }
}
Executor.terminals = {};
exports.Executor = Executor;
//# sourceMappingURL=executor.js.map