"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const buffers = require("./buffers");
const storage_1 = require("./storage");
class Recorder {
    constructor(storage) {
        this._buffers = 0;
        this._currentChanges = [];
        this._storage = storage;
        let subscriptions = [];
        vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, subscriptions);
        vscode.window.onDidChangeTextEditorSelection(this.onDidChangeTextEditorSelection, this, subscriptions);
        const insertNamedStop = vscode.commands.registerCommand("jevakallio.vscode-hacker-typer.insertNamedStop", this.insertNamedStop, this);
        const insertStop = vscode.commands.registerCommand("jevakallio.vscode-hacker-typer.insertStop", () => {
            this.insertStop(null);
        });
        const save = vscode.commands.registerCommand("jevakallio.vscode-hacker-typer.saveMacro", () => {
            this.saveRecording(save);
        });
        // Why?
        this._textEditor = vscode.window.activeTextEditor;
        this._disposable = vscode.Disposable.from(...subscriptions, insertNamedStop, insertStop, save);
        if (this._textEditor) {
            this.insertStartingPoint(this._textEditor);
        }
    }
    static register(context) {
        return () => {
            // reset global buffer
            buffers.clear();
            vscode.window.showInformationMessage("Hacker Typer is now recording!");
            const recorder = new Recorder(storage_1.default.getInstance(context));
            context.subscriptions.push(recorder);
        };
    }
    insertStartingPoint(textEditor) {
        const content = textEditor.document.getText();
        const selections = textEditor.selections;
        const language = textEditor.document.languageId;
        buffers.insert({
            position: this._buffers++,
            content,
            language,
            selections
        });
    }
    insertNamedStop() {
        vscode.window
            .showInputBox({
            prompt: "What do you want to call your stop point?",
            placeHolder: "Type a name or ENTER for unnamed stop point"
        })
            .then(name => {
            this.insertStop(name || null);
        });
    }
    insertStop(name) {
        buffers.insert({
            stop: {
                name: name || null
            },
            changes: null,
            selections: null,
            position: this._buffers++
        });
    }
    saveRecording(command) {
        vscode.window
            .showInputBox({
            prompt: "Give this thing a name",
            placeHolder: "cool-macro"
        })
            .then(name => {
            if (name) {
                return this._storage
                    .save({
                    name,
                    description: "",
                    buffers: buffers.all()
                })
                    .then(macro => {
                    vscode.window.showInformationMessage(`Saved ${macro.buffers.length} buffers under "${macro.name}".`);
                    command.dispose();
                });
            }
        });
    }
    onDidChangeTextDocument(e) {
        // @TODO: Gets called while playing -- need to stop recording once over
        // store changes, selection change will commit
        this._currentChanges = e.contentChanges;
    }
    onDidChangeTextEditorSelection(e) {
        // @TODO: Gets called while playing -- need to stop recording once over
        // Only allow recording to one active editor at a time
        // Breaks when you leave but that's fine for now.
        if (e.textEditor !== this._textEditor) {
            return;
        }
        const changes = this._currentChanges;
        const selections = e.selections || [];
        this._currentChanges = [];
        buffers.insert({
            changes,
            selections,
            position: this._buffers++
        });
    }
    dispose() {
        if (this._disposable) {
            this._disposable.dispose();
        }
    }
}
exports.default = Recorder;
//# sourceMappingURL=Recorder.js.map