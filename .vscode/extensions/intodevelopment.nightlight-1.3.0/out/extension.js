'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const nightlight_1 = require("./nightlight");
const nightlight_config_1 = require("./nightlight-config");
var nightlight = null;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    initialize();
    // Register commands
    let enableNightThemeCmd = vscode.commands.registerCommand('nightlight.enableNightTheme', () => {
        if (nightlight !== null) {
            nightlight.enableNightTheme(true);
        }
    });
    context.subscriptions.push(enableNightThemeCmd);
    let enableDayThemeCmd = vscode.commands.registerCommand('nightlight.enableDayTheme', () => {
        if (nightlight !== null) {
            nightlight.enableDayTheme(true);
        }
    });
    context.subscriptions.push(enableDayThemeCmd);
    let toggleThemeCmd = vscode.commands.registerCommand('nightlight.toggle', () => {
        if (nightlight !== null) {
            nightlight.toggleTheme();
        }
    });
    context.subscriptions.push(toggleThemeCmd);
    // Register on config change
    let configChanged = vscode.workspace.onDidChangeConfiguration((e) => {
        let affected = e.affectsConfiguration("nightlight");
        if (affected) {
            initialize();
        }
    });
    context.subscriptions.push(configChanged);
}
exports.activate = activate;
function initialize() {
    if (nightlight !== null) {
        nightlight.stop();
    }
    let config = nightlight_config_1.NightlightConfig.load();
    nightlight = new nightlight_1.Nightlight(config);
    nightlight.start();
}
// this method is called when your extension is deactivated
function deactivate() {
    if (nightlight !== null) {
        nightlight.stop();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map