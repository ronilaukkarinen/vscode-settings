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
const vscode = require("vscode");
const buffers = require("./buffers");
const storage_1 = require("./storage");
const Queue = require("promise-queue");
const stopPointBreakChar = `\n`; // ENTER
const replayConcurrency = 1;
const replayQueueMaxSize = Number.MAX_SAFE_INTEGER;
const replayQueue = new Queue(replayConcurrency, replayQueueMaxSize);
let isEnabled = false;
let currentBuffer;
function start(context) {
    const storage = storage_1.default.getInstance(context);
    const items = storage.list();
    vscode.window.showQuickPick(items.map(item => item.name)).then(picked => {
        if (!picked) {
            return;
        }
        const macro = storage.getByName(picked);
        buffers.inject(macro.buffers);
        currentBuffer = buffers.get(0);
        if (!currentBuffer) {
            vscode.window.showErrorMessage("No active recording");
            return;
        }
        const textEditor = vscode.window.activeTextEditor;
        if (buffers.isStartingPoint(currentBuffer)) {
            setStartingPoint(currentBuffer, textEditor);
        }
        isEnabled = true;
        vscode.window.showInformationMessage(`Now playing ${buffers.count()} buffers from ${macro.name}!`);
    });
}
exports.start = start;
function setStartingPoint(startingPoint, textEditor) {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = textEditor;
        // if no open text editor, open one
        if (!editor) {
            vscode.window.showInformationMessage("opening new window");
            const document = yield vscode.workspace.openTextDocument({
                language: startingPoint.language,
                content: startingPoint.content
            });
            editor = yield vscode.window.showTextDocument(document);
        }
        else {
            const existingEditor = editor;
            yield existingEditor.edit(edit => {
                // update initial file content
                const l = existingEditor.document.lineCount;
                const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(l, Math.max(0, existingEditor.document.lineAt(Math.max(0, l - 1)).text.length - 1)));
                edit.delete(range);
                edit.insert(new vscode.Position(0, 0), startingPoint.content);
            });
        }
        if (editor) {
            updateSelections(startingPoint.selections, editor);
            // language should always be defined, guard statement here
            // to support old recorded frames before language bit was added
            if (startingPoint.language) {
                // @TODO set editor language once the API becomes available:
                // https://github.com/Microsoft/vscode/issues/1800
            }
        }
        // move to next frame
        currentBuffer = buffers.get(startingPoint.position + 1);
    });
}
function disable() {
    isEnabled = false;
    currentBuffer = undefined;
}
exports.disable = disable;
function onType({ text }) {
    if (isEnabled) {
        replayQueue.add(() => new Promise((resolve, reject) => {
            try {
                advanceBuffer(resolve, text);
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
        }));
    }
    else {
        vscode.commands.executeCommand("default:type", { text });
    }
}
exports.onType = onType;
function onBackspace() {
    // move buffer one step backwards
    if (isEnabled && currentBuffer && currentBuffer.position > 0) {
        currentBuffer = buffers.get(currentBuffer.position - 1);
    }
    // actually execute backspace action
    vscode.commands.executeCommand("deleteLeft");
}
exports.onBackspace = onBackspace;
function updateSelections(selections, editor) {
    editor.selections = selections;
    // move scroll focus if needed
    const { start, end } = editor.selections[0];
    editor.revealRange(new vscode.Range(start, end), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}
function advanceBuffer(done, userInput) {
    const editor = vscode.window.activeTextEditor;
    const buffer = currentBuffer;
    if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
    }
    if (!buffer) {
        vscode.window.showErrorMessage("No buffer to advance");
        return;
    }
    if (buffers.isStopPoint(buffer)) {
        if (userInput === stopPointBreakChar) {
            currentBuffer = buffers.get(buffer.position + 1);
        }
        return done();
    }
    const { changes, selections } = buffer;
    const updateSelectionAndAdvanceToNextBuffer = () => {
        if (selections.length) {
            updateSelections(selections, editor);
        }
        currentBuffer = buffers.get(buffer.position + 1);
        // Ran out of buffers? Disable type capture.
        if (!currentBuffer) {
            disable();
        }
        done();
    };
    if (changes && changes.length > 0) {
        editor
            .edit(edit => applyContentChanges(changes, edit))
            .then(updateSelectionAndAdvanceToNextBuffer);
    }
    else {
        updateSelectionAndAdvanceToNextBuffer();
    }
}
function applyContentChanges(changes, edit) {
    changes.forEach(change => applyContentChange(change, edit));
}
function applyContentChange(change, edit) {
    if (change.text === "") {
        edit.delete(change.range);
    }
    else if (change.rangeLength === 0) {
        edit.insert(change.range.start, change.text);
    }
    else {
        edit.replace(change.range, change.text);
    }
}
//# sourceMappingURL=replay.js.map