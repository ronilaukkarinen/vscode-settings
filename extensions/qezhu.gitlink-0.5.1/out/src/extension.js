'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const git_urls_1 = require("git-urls");
let copyPaste = require("copy-paste");
function activate(context) {
    let gitlinkConfig = vscode.workspace.getConfiguration("gitlink");
    let gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', () => __awaiter(this, void 0, void 0, function* () { return gotoCommandAsync(gitlinkConfig); }));
    let copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', () => __awaiter(this, void 0, void 0, function* () { return copyCommandAsync(gitlinkConfig); }));
    context.subscriptions.push(gotoDisposable, copyDisposable);
}
exports.activate = activate;
function gotoCommandAsync(gitlinkConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        let position = vscode.window.activeTextEditor.selection;
        try {
            const linkMap = yield getOnlineLinkAsync(vscode.window.activeTextEditor.document.fileName, position);
            if (linkMap.size === 1) {
                return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.values().next().value));
            }
            let defaultRemote = gitlinkConfig["defaultRemote"];
            if (defaultRemote && linkMap.get(defaultRemote)) {
                return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.get(defaultRemote)));
            }
            const itemPickList = [];
            for (const [remoteName, url] of linkMap) {
                itemPickList.push({ label: remoteName, description: "" });
            }
            let choice = yield vscode.window.showQuickPick(itemPickList);
            if (choice === undefined) {
                return;
            }
            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.get(choice.label)));
        }
        catch (ex) {
            return vscode.window.showWarningMessage(ex.message);
        }
    });
}
function copyCommandAsync(gitlinkConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        let position = vscode.window.activeTextEditor.selection;
        try {
            const linkMap = yield getOnlineLinkAsync(vscode.window.activeTextEditor.document.fileName, position);
            if (linkMap.size === 1) {
                copyPaste.copy(linkMap.values().next().value);
                return vscode.window.showInformationMessage(`The link has been copied to the clipboard.`);
            }
            let defaultRemote = gitlinkConfig["defaultRemote"];
            if (defaultRemote && linkMap.get(defaultRemote)) {
                return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.get(defaultRemote)));
            }
            const itemPickList = [];
            for (const [remoteName, url] of linkMap) {
                itemPickList.push({ label: remoteName, description: "" });
            }
            let choice = yield vscode.window.showQuickPick(itemPickList);
            if (choice === undefined) {
                return;
            }
            copyPaste.copy(linkMap.get(choice.label));
            return vscode.window.showInformationMessage(`The link of ${choice.label} has been copied to the clipboard.`);
        }
        catch (ex) {
            return vscode.window.showWarningMessage(ex.message);
        }
    });
}
function getOnlineLinkAsync(filePath, position) {
    return __awaiter(this, void 0, void 0, function* () {
        return git_urls_1.default.getUrlsAsync(filePath, {
            startLine: position.start.line + 1,
            endLine: position.end.line + 1,
            startColumn: position.start.character + 1,
            endColumn: position.end.character + 1
        });
    });
}
//# sourceMappingURL=extension.js.map