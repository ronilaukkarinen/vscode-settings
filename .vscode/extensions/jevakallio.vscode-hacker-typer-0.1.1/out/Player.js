"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const buffers = require("./buffers");
class Player {
    constructor(editor, initialBuffer) {
        this._disposable = null;
        this._editor = editor;
        this._currentBuffer = initialBuffer;
    }
    static register(context) {
        return () => {
            const editor = vscode.window.activeTextEditor;
            const buffer = buffers.get(0);
            if (!editor) {
                vscode.window.showErrorMessage("No active editor");
                return;
            }
            if (!buffer) {
                vscode.window.showErrorMessage("No active recording");
                return;
            }
            vscode.window.showInformationMessage(`Now playing ${buffers.count()} frames!`);
            const player = new Player(editor, buffer);
            let type = vscode.commands.registerCommand("type", player.onType, player);
            context.subscriptions.push(player, type);
        };
    }
    onType({ text }) {
        this.advanceBuffer();
        //vscode.commands.executeCommand("default:type", { text });
    }
    onEvent(e) {
        // programmatic change
        if (e.kind === undefined) {
            return;
        }
        this.advanceBuffer();
    }
    advanceBuffer() {
        if (this._currentBuffer) {
            const editor = this._editor;
            editor.edit(edit => {
                const l = editor.document.lineCount;
                const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(l, editor.document.lineAt(l - 1).text.length));
                edit.delete(range);
                edit.insert(new vscode.Position(0, 0), this._currentBuffer.text);
                this._currentBuffer = buffers.get(this._currentBuffer.position + 1);
            });
        }
    }
    dispose() {
        if (this._disposable) {
            this._disposable.dispose();
        }
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map