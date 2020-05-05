"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
function activate(context) {
    // create a new word counter
    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);
}
exports.activate = activate;
class WordCounter {
    updateNestedRules() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        let editor = vscode_1.window.activeTextEditor;
        let doc = editor.document;
        let currentLine = editor.selections[0].active.line;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        if (doc.languageId === "scss") {
            const wordCount = this.getNestedRules(doc, currentLine);
            // Update the status bar
            this._statusBarItem.text = `${wordCount}`;
            this._statusBarItem.command = "";
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    }
    retriveCleanedText(docTxt) {
        if (!docTxt)
            return;
        return docTxt
            .match(/([^;]+{)|(})/g).join("") // remove properties
            .replace(/\/\/.*/g, "") // remove inline comments
            .replace(/\s{2,}|\s(?={)|\n/g, "") // trim spaces
            .replace(/(#{)(.*?)(})/g, "%7B$2%7D") // fix sass placeholder aka '#{}'
            .replace(/(\/\*.*?\*\/)|\/\*.*/g, ""); // remove multiline comments
    }
    /**
     * @description Remove open/closing brackets of the definitive path
     * @param docTxt Document text before the cursor
     */
    retriveCurrentPath(cleanedText) {
        let currentPath = cleanedText;
        while (currentPath.length > 0) {
            let currentFilter = currentPath.replace(/([^\s{}]|[\s])+{}/g, "");
            if (currentFilter === currentPath) {
                return currentFilter;
            }
            else {
                currentPath = currentFilter;
            }
        }
    }
    getNestedRules(doc, currentLine) {
        const startPos = new vscode_1.Position(0, 0);
        const endPos = new vscode_1.Position(currentLine, 0);
        const docContent = doc.getText(new vscode_1.Range(startPos, endPos));
        const cleanedText = this.retriveCleanedText(docContent);
        const cleanedPath = this.retriveCurrentPath(cleanedText);
        if (cleanedPath && cleanedPath.length > 1) {
            let _sobstituteBrakets = cleanedPath.replace(/([^#](?={))(.)/g, "$1  »  ");
            let _service = _sobstituteBrakets.replace(/%7B/g, "#{");
            var finalString = _service.replace(/%7D/g, "}");
        }
        else {
            var finalString = "";
        }
        return finalString;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class WordCounterController {
    constructor(wordCounter) {
        this._wordCounter = wordCounter;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._wordCounter.updateNestedRules();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._wordCounter.updateNestedRules();
    }
}
//# sourceMappingURL=extension.js.map