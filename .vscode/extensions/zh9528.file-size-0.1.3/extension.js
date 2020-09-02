const vscode = require('vscode');
const fs = require('fs');
const window = vscode.window;
const workspace = vscode.workspace;
const { getConfig } = require('./util');

const sizeConvert = size => {
    if (size >= 1048576) return `${Math.floor(size / 10485.76) / 100} MB`;
    else if (size >= 1024) return `${Math.floor(size / 10.24) / 100} KB`;
    else return `${size} B`;
};

const update = callback => new Promise((resolve) => resolve(window.activeTextEditor._documentData._document.fileName))
    .then((filepath) => callback(sizeConvert(fs.statSync(filepath).size)),
        () => callback());

function activate() {
    let saveway = 1;
    let config = getConfig(window, workspace);
    const callback = size => config.then(statusItem => {
        statusItem.text = size;
        size ? statusItem.show() : statusItem.hide();
    });
    update(callback);
    workspace.onDidChangeConfiguration(() => {
        config.then(statusItem => statusItem.dispose());
        config = getConfig(window, workspace);
        update(callback);
    });
    window.onDidChangeActiveTextEditor(() => update(callback));
    workspace.onWillSaveTextDocument(({ reason }) => saveway = reason);
    workspace.onDidSaveTextDocument(() => (saveway === 1 || saveway === 2) && update(callback));
}

exports.activate = activate;