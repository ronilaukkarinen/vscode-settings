"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
class InputObserver {
    constructor() {
        this._buffers = [];
        // subscribe to selection change events
        let subscriptions = [];
        vscode.window.onDidChangeTextEditorSelection(this.onEvent, this, subscriptions);
        // Why?
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    static register(context) {
        return () => {
            vscode.window.showInformationMessage("Now recording!");
            const observer = new InputObserver();
            context.subscriptions.push(observer);
        };
    }
    onEvent(e) {
        const text = e.textEditor.document.getText();
        const selections = e.selections;
        this._buffers.push({
            text,
            selections
        });
        if (this._buffers.length % 10 === 0) {
            vscode.window.showInformationMessage(this._buffers.length.toString());
        }
    }
    dispose() {
        this._disposable.dispose();
    }
}
exports.default = InputObserver;
//# sourceMappingURL=InputObserver.js.map