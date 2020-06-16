"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const versioning_1 = require("../helpers/versioning");
/** Initialization of the icons every time the theme get activated */
exports.showStartMessages = (themeStatus) => {
    return themeStatus.then((status) => {
        if (status === versioning_1.ThemeStatus.updated) {
            console.log('UPDATED');
        }
        else if (status === versioning_1.ThemeStatus.neverUsedBefore) {
            vscode.window.showInformationMessage('Thanks for using City Lights');
        }
    });
};
//# sourceMappingURL=start.js.map