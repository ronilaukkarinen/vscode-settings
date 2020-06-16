'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helpers = require("../helpers");
/** Command to toggle the folder icons */
exports.toggleFolderArrows = () => {
    return exports.checkArrowStatus()
        .then(showQuickPickItems)
        .then(handleQuickPickActions)
        .catch(err => console.log(err));
};
/** Show QuickPics items to select prefered configuration for the folder icons */
const showQuickPickItems = (status) => {
    const on = {
        description: 'ON',
        detail: 'Show folder arrows',
        label: !status ? '\u2714' : '\u25FB'
    };
    const off = {
        description: 'OFF',
        detail: 'Hide folder arrows',
        label: status ? '\u2714' : '\u25FB'
    };
    return vscode.window.showQuickPick([on, off], {
        placeHolder: 'Toggle folder arrows',
        ignoreFocusOut: false,
        matchOnDescription: true
    });
};
/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value) => {
    if (!value || !value.description)
        return;
    switch (value.description) {
        case 'ON': {
            helpers.setThemeConfig('hidesExplorerArrows', false, true);
            break;
        }
        case 'OFF': {
            helpers.setThemeConfig('hidesExplorerArrows', true, true);
            break;
        }
        default:
            break;
    }
};
/** Are the arrows enabled? */
exports.checkArrowStatus = () => {
    return helpers.getCityLightsIconJSON().then((config) => config.hidesExplorerArrows);
};
//# sourceMappingURL=folderArrows.js.map