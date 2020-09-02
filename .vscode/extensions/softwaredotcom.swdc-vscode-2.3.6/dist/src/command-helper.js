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
exports.createCommands = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("./DataController");
const MenuManager_1 = require("./menu/MenuManager");
const Util_1 = require("./Util");
const KpmProvider_1 = require("./tree/KpmProvider");
const CodeTimeMenuProvider_1 = require("./tree/CodeTimeMenuProvider");
const models_1 = require("./model/models");
const KpmProviderManager_1 = require("./tree/KpmProviderManager");
const ProjectCommitManager_1 = require("./menu/ProjectCommitManager");
const CodeTimeTeamProvider_1 = require("./tree/CodeTimeTeamProvider");
const ReportManager_1 = require("./menu/ReportManager");
const FileManager_1 = require("./managers/FileManager");
const AccountManager_1 = require("./menu/AccountManager");
const TrackerManager_1 = require("./managers/TrackerManager");
const SessionSummaryData_1 = require("./storage/SessionSummaryData");
function createCommands(kpmController) {
    let cmds = [];
    const tracker = TrackerManager_1.TrackerManager.getInstance();
    const kpmProviderMgr = KpmProviderManager_1.KpmProviderManager.getInstance();
    cmds.push(kpmController);
    // MENU TREE: INIT
    const codetimeMenuTreeProvider = new CodeTimeMenuProvider_1.CodeTimeMenuProvider();
    const codetimeMenuTreeView = vscode_1.window.createTreeView("ct-menu-tree", {
        treeDataProvider: codetimeMenuTreeProvider,
        showCollapseAll: false,
    });
    codetimeMenuTreeProvider.bindView(codetimeMenuTreeView);
    cmds.push(CodeTimeMenuProvider_1.connectCodeTimeMenuTreeView(codetimeMenuTreeView));
    // STATUS BAR CLICK - MENU TREE REVEAL
    cmds.push(vscode_1.commands.registerCommand("codetime.displayTree", () => {
        const item = SessionSummaryData_1.getStatusBarKpmItem();
        tracker.trackUIInteraction(item);
        codetimeMenuTreeProvider.revealTree();
    }));
    // SWITCH ACCOUNT BUTTON
    cmds.push(vscode_1.commands.registerCommand("codetime.switchAccounts", (item) => {
        tracker.trackUIInteraction(item);
        AccountManager_1.showSwitchAccountsMenu();
    }));
    // MENU TREE: REFRESH
    cmds.push(vscode_1.commands.registerCommand("codetime.refreshCodetimeMenuTree", () => {
        codetimeMenuTreeProvider.refresh();
    }));
    // PROCESS KEYSTROKES NOW
    cmds.push(vscode_1.commands.registerCommand("codetime.processKeystrokeData", () => {
        kpmController.processKeystrokeData(true /*isUnfocus*/);
    }));
    // DAILY METRICS TREE: INIT
    const kpmTreeProvider = new KpmProvider_1.KpmProvider();
    const kpmTreeView = vscode_1.window.createTreeView("ct-metrics-tree", {
        treeDataProvider: kpmTreeProvider,
        showCollapseAll: false,
    });
    kpmTreeProvider.bindView(kpmTreeView);
    cmds.push(KpmProvider_1.connectKpmTreeView(kpmTreeView));
    // TEAM TREE: INIT
    const codetimeTeamTreeProvider = new CodeTimeTeamProvider_1.CodeTimeTeamProvider();
    const codetimeTeamTreeView = vscode_1.window.createTreeView("ct-team-tree", {
        treeDataProvider: codetimeTeamTreeProvider,
        showCollapseAll: false,
    });
    codetimeTeamTreeProvider.bindView(codetimeTeamTreeView);
    cmds.push(CodeTimeTeamProvider_1.connectCodeTimeTeamTreeView(codetimeTeamTreeView));
    cmds.push(vscode_1.commands.registerCommand("codetime.refreshTreeViews", () => {
        codetimeMenuTreeProvider.refresh();
        kpmTreeProvider.refresh();
        codetimeTeamTreeProvider.refresh();
    }));
    // TEAM TREE: INVITE MEMBER
    cmds.push(vscode_1.commands.registerCommand("codetime.inviteTeamMember", (item) => __awaiter(this, void 0, void 0, function* () {
        // the identifier will be in the value
        const identifier = item.value;
        // email will be the description
        const email = item.description;
        const name = item.label;
        const msg = `Send invitation to ${email}?`;
        const selection = yield vscode_1.window.showInformationMessage(msg, { modal: true }, ...["YES"]);
        if (selection && selection === "YES") {
            DataController_1.sendTeamInvite(identifier, [email]);
        }
    })));
    // SEND OFFLINE DATA
    cmds.push(vscode_1.commands.registerCommand("codetime.sendOfflineData", () => {
        FileManager_1.sendOfflineData();
    }));
    // SHOW WEB ANALYTICS
    cmds.push(vscode_1.commands.registerCommand("codetime.softwareKpmDashboard", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getWebViewDashboardButton();
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.name = "ct_web_metrics_cmd";
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        DataController_1.launchWebDashboard();
    }));
    // OPEN SPECIFIED FILE IN EDITOR
    cmds.push(vscode_1.commands.registerCommand("codetime.openFileInEditor", (file) => {
        Util_1.openFileInEditor(file);
    }));
    // TOGGLE STATUS BAR METRIC VISIBILITY
    cmds.push(vscode_1.commands.registerCommand("codetime.toggleStatusBar", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getHideStatusBarMetricsButton();
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.name = "ct_toggle_status_bar_metrics_cmd";
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        Util_1.toggleStatusBar();
        setTimeout(() => {
            vscode_1.commands.executeCommand("codetime.refreshCodetimeMenuTree");
        }, 500);
    }));
    // LAUNCH EMAIL LOGIN
    cmds.push(vscode_1.commands.registerCommand("codetime.codeTimeLogin", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getSignUpButton("email", "grey");
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        Util_1.launchLogin("software");
    }));
    // LAUNCH GOOGLE LOGIN
    cmds.push(vscode_1.commands.registerCommand("codetime.googleLogin", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getSignUpButton("Google", null);
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.interactionIcon = null;
            item.color = null;
        }
        item.interactionIcon = "google";
        tracker.trackUIInteraction(item);
        Util_1.launchLogin("google");
    }));
    // LAUNCH GITHUB LOGIN
    cmds.push(vscode_1.commands.registerCommand("codetime.githubLogin", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getSignUpButton("GitHub", "white");
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        Util_1.launchLogin("github");
    }));
    // REFRESH DAILY METRICS
    cmds.push(vscode_1.commands.registerCommand("codetime.refreshKpmTree", () => {
        kpmTreeProvider.refresh();
    }));
    // DISPLAY README MD
    cmds.push(vscode_1.commands.registerCommand("codetime.displayReadme", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getLearnMoreButton();
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.name = "ct_learn_more_cmd";
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        Util_1.displayReadmeIfNotExists(true /*override*/);
    }));
    // DISPLAY CODE TIME METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand("codetime.codeTimeMetrics", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getCodeTimeDashboardButton();
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.name = "ct_summary_cmd";
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        MenuManager_1.displayCodeTimeMetricsDashboard();
    }));
    // DISPLAY PROJECT METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand("codetime.generateProjectSummary", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getViewProjectSummaryButton();
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.name = "ct_project_summary_cmd";
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        ProjectCommitManager_1.ProjectCommitManager.getInstance().launchViewProjectSummaryMenuFlow();
    }));
    // DISPLAY REPO COMMIT CONTRIBUTOR REPORT
    cmds.push(vscode_1.commands.registerCommand("codetime.generateContributorSummary", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getContributorReportButton(item.value);
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
            item.name = "ct_contributor_repo_identifier_cmd";
            item.interactionIcon = null;
            item.color = null;
        }
        tracker.trackUIInteraction(item);
        ReportManager_1.displayProjectContributorCommitsDashboard(item.value);
    }));
    // LAUNCH COMMIT URL
    cmds.push(vscode_1.commands.registerCommand("codetime.launchCommitUrl", (item, commitLink) => {
        // this only comes from the tree view so item will be available
        tracker.trackUIInteraction(item);
        Util_1.launchWebUrl(commitLink);
    }));
    cmds.push(vscode_1.commands.registerCommand("codetime.viewSoftwareTop40", () => {
        Util_1.launchWebUrl("https://api.software.com/music/top40");
    }));
    cmds.push(vscode_1.commands.registerCommand("codetime.sendFeedback", (item) => {
        if (!item) {
            // it's from the command palette, create a kpm item so
            // it can build the ui_element in the tracker manager
            item = kpmProviderMgr.getFeedbackButton();
            item.location = "ct_command_palette";
            item.interactionType = models_1.UIInteractionType.Keyboard;
        }
        tracker.trackUIInteraction(item);
        Util_1.launchWebUrl("mailto:cody@software.com");
    }));
    cmds.push(vscode_1.workspace.onDidChangeConfiguration((e) => DataController_1.updatePreferences()));
    return vscode_1.Disposable.from(...cmds);
}
exports.createCommands = createCommands;
//# sourceMappingURL=command-helper.js.map