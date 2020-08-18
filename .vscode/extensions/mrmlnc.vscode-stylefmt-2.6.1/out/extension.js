'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const stylefmt = require("./stylefmt");
const utils = require("./utils");
function getSettings(document) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    return Object.assign({}, vscode.workspace.getConfiguration('stylefmt', workspaceFolder.uri), vscode.workspace.getConfiguration('stylelint', workspaceFolder.uri), vscode.workspace.getConfiguration('editor', workspaceFolder.uri).get('formatOnSave'));
}
function needShowErrorMessages(settings) {
    return settings.formatOnSave ? false : settings.showErrorMessages;
}
function activate(context) {
    const outputChannel = null;
    // Supported languages
    const supportedDocuments = [
        { language: 'css', scheme: 'file' },
        { language: 'postcss', scheme: 'file' },
        { language: 'less', scheme: 'file' },
        { language: 'scss', scheme: 'file' },
        { language: 'sugarss', scheme: 'file' }
    ];
    // For plugin command: "stylefmt.execute"
    const command = vscode.commands.registerTextEditorCommand('stylefmt.execute', (textEditor) => {
        const document = textEditor.document;
        const settings = getSettings(document);
        const needShowErrors = needShowErrorMessages(settings);
        stylefmt
            .use(settings, document, null)
            .then((result) => {
            textEditor.edit((editBuilder) => {
                editBuilder.replace(result.range, result.css);
            });
        })
            .catch((err) => utils.output(outputChannel, err, needShowErrors));
    });
    // For commands: "Format Document" and "Format Selection"
    const format = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
        provideDocumentRangeFormattingEdits(document, range) {
            const settings = getSettings(document);
            const needShowErrors = needShowErrorMessages(settings);
            return stylefmt
                .use(settings, document, range)
                .then((result) => [vscode.TextEdit.replace(range, result.css)])
                .catch((err) => utils.output(outputChannel, err, needShowErrors));
        }
    });
    // Subscriptions
    context.subscriptions.push(command);
    context.subscriptions.push(format);
}
exports.activate = activate;
