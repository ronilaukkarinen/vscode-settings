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
const tmp = require("tmp");
const svgexport = require("svgexport");
const fs = require("pn/fs");
const cp = require("copy-paste");
const svgProvider_1 = require("../svgProvider");
function saveFileAs(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let resource = uri;
        const textDocument = yield loadTextDocument(resource);
        if (svgProvider_1.SvgDocumentContentProvider.checkNoSvg(textDocument))
            return;
        const text = textDocument.getText();
        const tmpobj = tmp.fileSync({ 'postfix': '.svg' });
        const pngpath = resource.fsPath.replace('.svg', '.png');
        exportPng(tmpobj, text, pngpath);
    });
}
function saveFileAsSize(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let resource = uri;
        const textDocument = yield loadTextDocument(resource);
        if (svgProvider_1.SvgDocumentContentProvider.checkNoSvg(textDocument))
            return;
        const text = textDocument.getText();
        const tmpobj = tmp.fileSync({ 'postfix': '.svg' });
        const pngpath = resource.fsPath.replace('.svg', '.png');
        creatInputBox('width')
            .then(width => {
            if (width) {
                creatInputBox('height')
                    .then(height => {
                    if (height) {
                        exportPng(tmpobj, text, pngpath, Number(width), Number(height));
                    }
                });
            }
        });
    });
}
function loadTextDocument(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(resource instanceof vscode.Uri)) {
            if (vscode.window.activeTextEditor) {
                resource = vscode.window.activeTextEditor.document.uri;
            }
            if (!(resource instanceof vscode.Uri))
                return null;
        }
        return yield vscode.workspace.openTextDocument(resource);
    });
}
function copyDataUri(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let resource = uri;
        const textDocument = yield loadTextDocument(resource);
        if (svgProvider_1.SvgDocumentContentProvider.checkNoSvg(textDocument))
            return;
        const text = textDocument.getText();
        cp.copy('data:image/svg+xml,' + encodeURIComponent(text));
    });
}
class SaveAsCommand {
    constructor() {
        this.id = 'svgviewer.saveas';
    }
    execute(mainUri, allUris) {
        for (const uri of Array.isArray(allUris) ? allUris : [mainUri]) {
            saveFileAs(uri);
        }
    }
}
exports.SaveAsCommand = SaveAsCommand;
class SaveAsSizeCommand {
    constructor() {
        this.id = 'svgviewer.saveassize';
    }
    execute(mainUri, allUris) {
        for (const uri of Array.isArray(allUris) ? allUris : [mainUri]) {
            saveFileAsSize(uri);
        }
    }
}
exports.SaveAsSizeCommand = SaveAsSizeCommand;
class CopyDataUriCommand {
    constructor() {
        this.id = 'svgviewer.copydui';
    }
    execute(mainUri, allUris) {
        copyDataUri(mainUri);
    }
}
exports.CopyDataUriCommand = CopyDataUriCommand;
function exportPng(tmpobj, text, pngpath, w, h) {
    console.log(`export width:${w} height:${h}`);
    fs.writeFile(tmpobj.name, text, 'utf-8')
        .then((_) => {
        svgexport.render({
            'input': tmpobj.name,
            'output': `${pngpath} pad ${w || ''}${w == null && h == null ? '' : ':'}${h || ''}`
        }, function (err) {
            if (!err)
                vscode.window.showInformationMessage('export done. ' + pngpath);
            else
                vscode.window.showErrorMessage(err);
        });
    })
        .catch((e) => vscode.window.showErrorMessage(e.message));
}
function creatInputBox(param) {
    return vscode.window.showInputBox({
        prompt: `Set ${param} of the png.`,
        placeHolder: `${param}`,
        validateInput: checkSizeInput
    });
}
function checkSizeInput(value) {
    return value !== '' && !isNaN(Number(value)) && Number(value) > 0
        ? null : 'Please set number.';
}
//# sourceMappingURL=saveFile.js.map