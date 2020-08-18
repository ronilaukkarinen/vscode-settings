"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayWeeklyCommitSummary = exports.displayCodeTimeMetricsDashboard = exports.launchWebDashboardView = exports.showMenuOptions = exports.buildWebDashboardUrl = exports.showQuickPick = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
const Constants_1 = require("../Constants");
const ProgressManager_1 = require("../managers/ProgressManager");
/**
 * Pass in the following array of objects
 * options: {placeholder, items: [{label, description, url, detail, tooltip},...]}
 */
function showQuickPick(pickOptions) {
    if (!pickOptions || !pickOptions["items"]) {
        return;
    }
    let options = {
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: pickOptions.placeholder || "",
    };
    return vscode_1.window.showQuickPick(pickOptions.items, options).then((item) => __awaiter(this, void 0, void 0, function* () {
        if (item) {
            let url = item["url"];
            let cb = item["cb"];
            let command = item["command"];
            if (url) {
                Util_1.launchWebUrl(url);
            }
            else if (cb) {
                cb();
            }
            else if (command) {
                vscode_1.commands.executeCommand(command);
            }
        }
        return item;
    }));
}
exports.showQuickPick = showQuickPick;
function buildWebDashboardUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        return Constants_1.launch_url;
    });
}
exports.buildWebDashboardUrl = buildWebDashboardUrl;
function showMenuOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        const loggedIn = yield DataController_1.isLoggedIn();
        // {placeholder, items: [{label, description, url, details, tooltip},...]}
        let kpmMenuOptions = {
            items: [],
        };
        kpmMenuOptions.items.push({
            label: "Generate dashboard",
            detail: "View your latest coding metrics right here in your editor",
            url: null,
            cb: displayCodeTimeMetricsDashboard,
            eventDescription: "PaletteMenuLaunchDashboard",
        });
        let loginMsgDetail = "Finish creating your account and see rich data visualizations.";
        if (!loggedIn) {
            kpmMenuOptions.items.push({
                label: Constants_1.LOGIN_LABEL,
                detail: loginMsgDetail,
                url: null,
                cb: Util_1.launchLogin,
                eventDescription: "PaletteMenuLogin",
            });
        }
        let toggleStatusBarTextLabel = "Hide status bar metrics";
        if (!Util_1.isStatusBarTextVisible()) {
            toggleStatusBarTextLabel = "Show status bar metrics";
        }
        kpmMenuOptions.items.push({
            label: toggleStatusBarTextLabel,
            detail: "Toggle the Code Time status bar metrics text",
            url: null,
            cb: null,
            command: "codetime.toggleStatusBar",
        });
        kpmMenuOptions.items.push({
            label: "Submit an issue on GitHub",
            detail: "Encounter a bug? Submit an issue on our GitHub page",
            url: "https://github.com/swdotcom/swdc-vscode/issues",
            cb: null,
        });
        kpmMenuOptions.items.push({
            label: "Submit feedback",
            detail: "Send us an email at cody@software.com",
            cb: null,
            command: "codetime.sendFeedback",
        });
        if (loggedIn) {
            kpmMenuOptions.items.push({
                label: "Web dashboard",
                detail: "See rich data visualizations in the web app",
                url: null,
                cb: launchWebDashboardView,
                eventDescription: "PaletteMenuLaunchWebDashboard",
            });
        }
        // kpmMenuOptions.items.push({
        //     label:
        //         "___________________________________________________________________",
        //     cb: null,
        //     url: null,
        //     command: null
        // });
        // const atlassianAccessToken = getItem("atlassian_access_token");
        // if (!atlassianAccessToken) {
        //     kpmMenuOptions.items.push({
        //         label: "Connect Atlassian",
        //         detail: "To integrate with your Jira projects",
        //         cb: null,
        //         command: "codetime.connectAtlassian"
        //     });
        // }
        showQuickPick(kpmMenuOptions);
    });
}
exports.showMenuOptions = showMenuOptions;
function launchWebDashboardView() {
    return __awaiter(this, void 0, void 0, function* () {
        let webUrl = yield buildWebDashboardUrl();
        Util_1.launchWebUrl(`${webUrl}/login`);
    });
}
exports.launchWebDashboardView = launchWebDashboardView;
function displayCodeTimeMetricsDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1st write the code time metrics dashboard file
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "Loading summary...",
            cancellable: false,
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            const progressMgr = ProgressManager_1.ProgressManager.getInstance();
            progressMgr.doneWriting = false;
            progressMgr.reportProgress(progress, 20);
            yield DataController_1.writeCodeTimeMetricsDashboard();
            progressMgr.doneWriting = true;
            const filePath = Util_1.getDashboardFile();
            vscode_1.workspace.openTextDocument(filePath).then((doc) => {
                // only focus if it's not already open
                vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
                    // done
                });
                progress.report({ increment: 100 });
            });
        }));
    });
}
exports.displayCodeTimeMetricsDashboard = displayCodeTimeMetricsDashboard;
function displayWeeklyCommitSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1st write the commit summary data, then show it
        yield DataController_1.writeCommitSummaryData();
        const filePath = Util_1.getCommitSummaryFile();
        vscode_1.workspace.openTextDocument(filePath).then((doc) => {
            // only focus if it's not already open
            vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
                // done
            });
        });
    });
}
exports.displayWeeklyCommitSummary = displayWeeklyCommitSummary;
//# sourceMappingURL=MenuManager.js.map