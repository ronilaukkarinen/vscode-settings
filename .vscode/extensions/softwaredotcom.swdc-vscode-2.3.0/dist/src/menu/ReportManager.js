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
exports.generateDailyReport = exports.displayProjectContributorCommitsDashboard = exports.displayProjectCommitsDashboardByRangeType = exports.displayProjectCommitsDashboardByStartEnd = void 0;
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const vscode_1 = require("vscode");
const SlackManager_1 = require("./SlackManager");
const ProgressManager_1 = require("../managers/ProgressManager");
function displayProjectCommitsDashboardByStartEnd(start, end, projectIds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "Loading project summary...",
            cancellable: false,
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            const progressMgr = ProgressManager_1.ProgressManager.getInstance();
            progressMgr.doneWriting = false;
            progressMgr.reportProgress(progress, 20);
            // 1st write the code time metrics dashboard file
            yield DataController_1.writeProjectCommitDashboardByStartEnd(start, end, projectIds);
            progressMgr.doneWriting = true;
            openProjectCommitDocument();
            progress.report({ increment: 100 });
        }));
    });
}
exports.displayProjectCommitsDashboardByStartEnd = displayProjectCommitsDashboardByStartEnd;
function displayProjectCommitsDashboardByRangeType(type = "lastWeek", projectIds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "Loading project summary...",
            cancellable: false,
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            const progressMgr = ProgressManager_1.ProgressManager.getInstance();
            progressMgr.doneWriting = false;
            progressMgr.reportProgress(progress, 20);
            // 1st write the code time metrics dashboard file
            yield DataController_1.writeProjectCommitDashboardByRangeType(type, projectIds);
            progressMgr.doneWriting = true;
            openProjectCommitDocument();
            progress.report({ increment: 100 });
        }));
    });
}
exports.displayProjectCommitsDashboardByRangeType = displayProjectCommitsDashboardByRangeType;
function openProjectCommitDocument() {
    const filePath = Util_1.getProjectCodeSummaryFile();
    vscode_1.workspace.openTextDocument(filePath).then((doc) => {
        // only focus if it's not already open
        vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
            // done
        });
    });
}
function displayProjectContributorCommitsDashboard(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1st write the code time metrics dashboard file
        yield DataController_1.writeProjectContributorCommitDashboardFromGitLogs(identifier);
        const filePath = Util_1.getProjectContributorCodeSummaryFile();
        vscode_1.workspace.openTextDocument(filePath).then((doc) => {
            // only focus if it's not already open
            vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
                // done
            });
        });
    });
}
exports.displayProjectContributorCommitsDashboard = displayProjectContributorCommitsDashboard;
function generateDailyReport(type = "yesterday", projectIds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        yield DataController_1.writeDailyReportDashboard(type, projectIds);
        const filePath = Util_1.getDailyReportSummaryFile();
        vscode_1.workspace.openTextDocument(filePath).then((doc) => {
            // only focus if it's not already open
            vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => __awaiter(this, void 0, void 0, function* () {
                const submitToSlack = yield vscode_1.window.showInformationMessage("Submit report to slack?", ...["Yes"]);
                if (submitToSlack && submitToSlack === "Yes") {
                    // take the content and send it to a selected channel
                    SlackManager_1.sendGeneratedReportReport();
                }
            }));
        });
    });
}
exports.generateDailyReport = generateDailyReport;
//# sourceMappingURL=ReportManager.js.map