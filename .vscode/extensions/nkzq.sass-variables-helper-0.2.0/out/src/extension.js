'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sassVariables_1 = require("./sassVariables");
const ncp = require('copy-paste');
function activate(context) {
    // Following are just data provider samples
    const sassFileRoute = vscode.workspace.getConfiguration('sassVariablesHelper').route[0] === '/' ? vscode.workspace.getConfiguration('sassVariablesHelper').route : `/${vscode.workspace.getConfiguration('sassVariablesHelper').route}`;
    let rootPath = '';
    if (sassFileRoute) {
        rootPath = vscode.workspace.rootPath + sassFileRoute;
    }
    const sassVariablesProvider = new sassVariables_1.colorProvider(rootPath);
    vscode.window.registerTreeDataProvider('sassVariables', sassVariablesProvider);
    vscode.commands.registerCommand('sassVariables.refreshEntry', () => sassVariablesProvider.refresh());
    vscode.commands.registerCommand('extension.openPackageOnNpm', colorName => {
        ncp.copy(`$${colorName}`, () => {
            vscode.window.showInformationMessage('Variable copied to clipboard');
        });
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map