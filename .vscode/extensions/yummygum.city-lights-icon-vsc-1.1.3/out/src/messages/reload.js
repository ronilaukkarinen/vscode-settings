"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/** User has to confirm it he wants to reload the editor */
exports.showConfirmToReloadMessage = () => {
    return new Promise((resolve, reject) => {
        vscode.window.showInformationMessage('You have to restart VS Code to activate the changes to the icons.', 'Restart').then(value => {
            switch (value) {
                case 'Restart':
                    resolve(true);
                    break;
                default:
                    resolve(false);
            }
        });
    });
};
//# sourceMappingURL=reload.js.map