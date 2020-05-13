"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var vscode = __importStar(require("vscode"));
var path = __importStar(require("path"));
var html_validate_1 = require("html-validate");
var WARN = 1;
var ERROR = 2;
function activate(context) {
    var timeout = undefined;
    var errorDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "#FF000055"
    });
    var warnDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "#FFFF0055"
    });
    var activeEditor = vscode.window.activeTextEditor;
    var loader = new html_validate_1.ConfigLoader(html_validate_1.Config);
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        var workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }
        var htmlValidate;
        try {
            var rulesPath = getRulesPath();
            var config = void 0;
            if (rulesPath) {
                var targetFile = path.resolve(workspaceFolders[0].uri.fsPath, rulesPath);
                config = loader.fromTarget(targetFile);
            }
            else {
                config = loader.fromTarget(activeEditor.document.fileName);
            }
            htmlValidate = new html_validate_1.HtmlValidate(config.get());
        }
        catch (error) {
            htmlValidate = new html_validate_1.HtmlValidate();
        }
        var text = activeEditor.document.getText();
        var report = htmlValidate.validateString(text);
        var htmlErrors = [];
        var htmlWarnings = [];
        for (var i = 0; i < report.results.length; i++) {
            var result = report.results[i];
            for (var j = 0; j < result.messages.length; j++) {
                var message = result.messages[j];
                if (message.severity == WARN) {
                    htmlWarnings.push({ range: activeEditor.document.lineAt(message.line - 1).range, hoverMessage: message.message });
                }
                else if (message.severity == ERROR) {
                    htmlErrors.push({ range: activeEditor.document.lineAt(message.line - 1).range, hoverMessage: message.message });
                }
            }
        }
        activeEditor.setDecorations(errorDecorationType, htmlErrors);
        activeEditor.setDecorations(warnDecorationType, htmlWarnings);
    }
    function getRulesPath() {
        var configuration = vscode.workspace.getConfiguration("html-validate");
        return configuration.get("rulesPath");
    }
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(function (event) {
        if (activeEditor && event === activeEditor.document) {
            triggerUpdateDecorations();
        }
    });
    vscode.workspace.onDidChangeTextDocument(function (event) {
        var configuration = vscode.workspace.getConfiguration('html-validate');
        var runOnEdit = configuration.get("runOnEdit");
        if (runOnEdit) {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
