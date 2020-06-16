'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands = require("./commands");
const changeDetection_1 = require("./helpers/changeDetection");
const versioning_1 = require("./helpers/versioning");
const start_1 = require("./messages/start");
/**
 * This method is called when the extension is activated.
 * It initializes the core functionality of the extension.
 */
function activate(context) {
    start_1.showStartMessages(versioning_1.checkThemeStatus(context.globalState));
    // Adding commands to the editor
    context.subscriptions.push(...commands.commands);
    // Initially trigger the config change detection
    changeDetection_1.detectConfigChanges().catch(e => {
        console.error(e);
    });
    vscode.workspace.onDidChangeConfiguration(changeDetection_1.detectConfigChanges);
}
exports.activate = activate;
/** This method is called when the extension is deactivated */
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map