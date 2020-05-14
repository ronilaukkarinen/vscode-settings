'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const postcss = require("postcss");
const scssSyntax = require("postcss-scss");
const stylefmt = require("stylefmt");
const settingsManager = require("./settings-manager");
function use(settings, document, range) {
    const rootDirectory = vscode.workspace.rootPath || '';
    const stylefmtConfig = settingsManager.prepare(rootDirectory, settings);
    let text;
    if (!range) {
        const lastLine = document.lineAt(document.lineCount - 1);
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(document.lineCount - 1, lastLine.text.length);
        range = new vscode.Range(start, end);
        text = document.getText();
    }
    else {
        text = document.getText(range);
    }
    const postcssConfig = {
        from: document.uri.fsPath || vscode.workspace.rootPath || '',
        syntax: scssSyntax
    };
    const postcssPlugins = [
        stylefmt(stylefmtConfig)
    ];
    return postcss(postcssPlugins)
        .process(text, postcssConfig)
        .then((result) => ({
        css: result.css,
        range
    }));
}
exports.use = use;
