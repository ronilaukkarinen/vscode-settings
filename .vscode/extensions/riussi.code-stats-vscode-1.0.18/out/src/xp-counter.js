"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const pulse_1 = require("./pulse");
const code_stats_api_1 = require("./code-stats-api");
const profile_provider_1 = require("./profile-provider");
const path = require("path");
class XpCounter {
    constructor(context) {
        // wait 10s after each change in the document before sending an update
        this.UPDATE_DELAY = 10000;
        // List of detected output languages to filter out and not send to the backend.
        this.filterOutLanguages = [
            "arduino-output",
            "code-runner-output",
            "jest-snapshot",
            "Diff",
            "testOutput",
            "Log"
        ];
        this.pulse = new pulse_1.Pulse();
        this.initAPI();
        let subscriptions = [];
        if (!this.statusBarItem) {
            this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
            this.statusBarItem.command = "code-stats.profile";
        }
        subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider('code-stats', new profile_provider_1.ProfileProvider(context, this.api)));
        subscriptions.push(vscode_1.commands.registerCommand("code-stats.profile", () => {
            let config = vscode_1.workspace.getConfiguration("codestats");
            if (!config) {
                vscode_1.window.showErrorMessage('codestats.username configuration setting is missing');
                return;
            }
            if (config.get("username") === '') {
                vscode_1.window.showErrorMessage('codestats.username configuration setting is missing');
                return;
            }
            const panel = vscode_1.window.createWebviewPanel('codeStatsPanel', 'Code::Stats Profile', vscode_1.ViewColumn.Two, {
                localResourceRoots: [vscode_1.Uri.file(path.join(context.extensionPath, 'assets'))]
            });
            vscode_1.workspace.openTextDocument(vscode_1.Uri.parse('code-stats://profile')).then((value) => {
                panel.webview.html = value.getText();
            });
        }));
        vscode_1.workspace.onDidChangeTextDocument(this.onTextDocumentChanged, this, subscriptions);
        vscode_1.workspace.onDidChangeConfiguration(this.initAPI, this, subscriptions);
        this.combinedDisposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this.combinedDisposable.dispose();
        this.statusBarItem.dispose();
    }
    onTextDocumentChanged(event) {
        this.updateXpCount(event.document, 1);
    }
    updateXpCount(document, changeCount) {
        let show;
        if (this.isSupportedLanguage(document.languageId)) {
            this.pulse.addXP(document.languageId, changeCount);
            show = true;
        }
        else {
            show = false;
        }
        this.updateStatusBar(show, `${this.pulse.getXP(document.languageId)}`);
        // each change resets the timeout so we only send updates when there is a 10s delay in updates to the document
        if (this.updateTimeout !== null) {
            clearTimeout(this.updateTimeout);
        }
        this.updateTimeout = setTimeout(() => {
            const promise = this.api.sendUpdate(this.pulse);
            if (promise !== null) {
                promise.then(() => {
                    this.updateStatusBar(show, `${this.pulse.getXP(document.languageId)}`);
                });
            }
        }, this.UPDATE_DELAY);
    }
    updateStatusBar(show, changeCount) {
        if (!show) {
            this.statusBarItem.hide();
        }
        else {
            this.statusBarItem.text = `$(pencil) C::S ${changeCount}`;
            this.statusBarItem.show();
        }
    }
    isSupportedLanguage(language) {
        // Check if detected language is something we don't want to send to backend like the code runner output
        if (this.filterOutLanguages.includes(language)) {
            console.log("Filtering out " + language);
            return false;
        }
        return true;
    }
    initAPI() {
        let config = vscode_1.workspace.getConfiguration("codestats");
        if (!config) {
            return;
        }
        const apiKey = config.get("apikey");
        const apiURL = config.get("apiurl");
        const userName = config.get("username");
        console.log(`code-stats-vscode setting up:
      API URL: ${apiURL}
      NAME:    ${userName}      
      KEY:     ${apiKey}
      `);
        if (this.api != null)
            this.api.updateSettings(apiKey, apiURL, userName);
        else
            this.api = new code_stats_api_1.CodeStatsAPI(apiKey, apiURL, userName);
    }
}
exports.XpCounter = XpCounter;
//# sourceMappingURL=xp-counter.js.map