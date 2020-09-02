const vscode = require('vscode');

const getConfig = (window, workspace) => new Promise((resolve) => {
    const configuration = workspace.getConfiguration('file-size');
    resolve({
        position: configuration.get('position'),
        priority: configuration.get('priority')
    });
})
    .then(({ position, priority }) => window.createStatusBarItem(position == 'left' ?
        vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right,
        priority));

exports.getConfig = getConfig;