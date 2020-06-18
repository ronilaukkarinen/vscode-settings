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
const KpmProviderManager_1 = require("./tree/KpmProviderManager");
const ProjectCommitManager_1 = require("./menu/ProjectCommitManager");
const CodeTimeTeamProvider_1 = require("./tree/CodeTimeTeamProvider");
const ReportManager_1 = require("./menu/ReportManager");
const FileManager_1 = require("./managers/FileManager");
const PluginDataManager_1 = require("./managers/PluginDataManager");
const AccountManager_1 = require("./menu/AccountManager");
function createCommands(kpmController) {
    let cmds = [];
    cmds.push(kpmController);
    // MENU TREE: INIT
    const codetimeMenuTreeProvider = new CodeTimeMenuProvider_1.CodeTimeMenuProvider();
    const codetimeMenuTreeView = vscode_1.window.createTreeView("ct-menu-tree", {
        treeDataProvider: codetimeMenuTreeProvider,
        showCollapseAll: false,
    });
    codetimeMenuTreeProvider.bindView(codetimeMenuTreeView);
    cmds.push(CodeTimeMenuProvider_1.connectCodeTimeMenuTreeView(codetimeMenuTreeView));
    // MENU TREE: REVEAL
    cmds.push(vscode_1.commands.registerCommand("codetime.displayTree", () => {
        codetimeMenuTreeProvider.revealTree();
    }));
    // SWITCH ACCOUNTS MENU BUTTON
    cmds.push(vscode_1.commands.registerCommand("codetime.showAccountInfoMenu", () => {
        AccountManager_1.showSwitchAccountsMenu();
    }));
    // SWITCH ACCOUNTS PROCESS BUTTON
    cmds.push(vscode_1.commands.registerCommand("codetime.switchAccounts", () => {
        AccountManager_1.processSwitchAccounts();
    }));
    // MENU TREE: REFRESH
    cmds.push(vscode_1.commands.registerCommand("codetime.refreshCodetimeMenuTree", () => {
        codetimeMenuTreeProvider.refresh();
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
    // TEAM TREE: REFRESH
    cmds.push(vscode_1.commands.registerCommand("codetime.refreshCodetimeTeamTree", () => {
        codetimeTeamTreeProvider.refresh();
    }));
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
        // clear the time counter stats
        PluginDataManager_1.PluginDataManager.getInstance().clearStatsForPayloadProcess();
    }));
    // SHOW ASCII DASHBOARD
    cmds.push(vscode_1.commands.registerCommand("codetime.softwareKpmDashboard", () => {
        DataController_1.handleKpmClickedEvent();
    }));
    // OPEN SPECIFIED FILE IN EDITOR
    cmds.push(vscode_1.commands.registerCommand("codetime.openFileInEditor", (file) => {
        Util_1.openFileInEditor(file);
    }));
    // REFRESH MENU
    cmds.push(vscode_1.commands.registerCommand("codetime.toggleStatusBar", () => {
        Util_1.toggleStatusBar();
        setTimeout(() => {
            vscode_1.commands.executeCommand("codetime.refreshCodetimeMenuTree");
        }, 500);
    }));
    // LAUNCH EMAIL LOGIN
    cmds.push(vscode_1.commands.registerCommand("codetime.codeTimeLogin", () => {
        Util_1.launchLogin("software");
    }));
    // LAUNCH GOOGLE LOGIN
    cmds.push(vscode_1.commands.registerCommand("codetime.googleLogin", () => {
        Util_1.launchLogin("google");
    }));
    // LAUNCH GITHUB LOGIN
    cmds.push(vscode_1.commands.registerCommand("codetime.githubLogin", () => {
        Util_1.launchLogin("github");
    }));
    // LAUNCH LINK ACCOUNT OPTION
    cmds.push(vscode_1.commands.registerCommand("codetime.linkAccount", () => {
        // disabled for now
        // launchLogin("linkAccount");
    }));
    // REFRESH DAILY METRICS
    cmds.push(vscode_1.commands.registerCommand("codetime.refreshKpmTree", (keystrokeStats) => {
        if (keystrokeStats) {
            KpmProviderManager_1.KpmProviderManager.getInstance().setCurrentKeystrokeStats(keystrokeStats);
        }
        kpmTreeProvider.refresh();
    }));
    // DISPLAY README MD
    cmds.push(vscode_1.commands.registerCommand("codetime.displayReadme", () => {
        Util_1.displayReadmeIfNotExists(true /*override*/);
    }));
    // DISPLAY CODE TIME METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand("codetime.codeTimeMetrics", () => {
        MenuManager_1.displayCodeTimeMetricsDashboard();
    }));
    // DISPLAY PROJECT METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand("codetime.generateProjectSummary", () => {
        ProjectCommitManager_1.ProjectCommitManager.getInstance().launchProjectCommitMenuFlow();
    }));
    // DISPLAY REPO COMMIT CONTRIBUTOR REPORT
    cmds.push(vscode_1.commands.registerCommand("codetime.generateContributorSummary", (identifier) => {
        ReportManager_1.displayProjectContributorCommitsDashboard(identifier);
    }));
    // LAUNCH COMMIT URL
    cmds.push(vscode_1.commands.registerCommand("codetime.launchCommitUrl", (commitLink) => {
        Util_1.launchWebUrl(commitLink);
    }));
    // DISPLAY PALETTE MENU
    cmds.push(vscode_1.commands.registerCommand("codetime.softwarePaletteMenu", () => {
        MenuManager_1.showMenuOptions();
    }));
    cmds.push(vscode_1.commands.registerCommand("codetime.viewSoftwareTop40", () => {
        Util_1.launchWebUrl("https://api.software.com/music/top40");
    }));
    cmds.push(vscode_1.commands.registerCommand("codetime.codeTimeStatusToggle", () => {
        Util_1.handleCodeTimeStatusToggle();
    }));
    cmds.push(vscode_1.commands.registerCommand("codetime.sendFeedback", () => {
        Util_1.launchWebUrl("mailto:cody@software.com");
    }));
    // // CONNECT SLACK
    // cmds.push(
    //     commands.registerCommand("codetime.connectSlack", () => {
    //         connectSlack();
    //     })
    // );
    // // DISCONNECT SLACK
    // cmds.push(
    //     commands.registerCommand("codetime.disconnectSlack", () => {
    //         disconnectSlack();
    //     })
    // );
    // // SLACK CONTRIBUTOR
    // cmds.push(
    //     commands.registerCommand("musictime.slackContributor", () => {
    //         slackContributor();
    //     })
    // );
    // // GENERATE SLACK REPORT
    // cmds.push(
    //     commands.registerCommand("codetime.generateSlackReport", () => {
    //         generateSlackReport();
    //     })
    // );
    // const addProjectNoteCmd = commands.registerCommand(
    //     "codetime.addProjectNote",
    //     () => {
    //         ProjectNoteManager.getInstance().addNote();
    //     }
    // );
    // cmds.push(addProjectNoteCmd);
    // const connectAtlassianCmd = commands.registerCommand(
    //     "codetime.connectAtlassian",
    //     () => {
    //         connectAtlassian();
    //     }
    // );
    // cmds.push(connectAtlassianCmd);
    // const copyToJiraCmd = commands.registerCommand(
    //     "codetime.copyToJira",
    //     doc => {
    //         /**
    //         authority:""
    //         fragment:""
    //         fsPath:"/Users/xavierluiz/software/swdc-job-service/app/jobs/songStats.job.js"
    //         path:"/Users/xavierluiz/software/swdc-job-service/app/jobs/songStats.job.js"
    //         query:""
    //         scheme:"file"
    //          */
    //         KpmController.getInstance().processSelectedTextForJira();
    //     }
    // );
    // cmds.push(copyToJiraCmd);
    cmds.push(vscode_1.workspace.onDidChangeConfiguration((e) => DataController_1.updatePreferences()));
    return vscode_1.Disposable.from(...cmds);
}
exports.createCommands = createCommands;
//# sourceMappingURL=command-helper.js.map