"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeTimeEvent = exports.CommitChangeStats = exports.LoggedInState = exports.SessionSummary = exports.FileChangeInfo = exports.DocumentChangeInfo = exports.KeystrokeAggregate = exports.KpmItem = exports.UIInteractionType = void 0;
const Util_1 = require("../Util");
const Constants_1 = require("../Constants");
const vscode_1 = require("vscode");
var UIInteractionType;
(function (UIInteractionType) {
    UIInteractionType["Keyboard"] = "keyboard";
    UIInteractionType["Click"] = "click";
})(UIInteractionType = exports.UIInteractionType || (exports.UIInteractionType = {}));
class KpmItem {
    constructor() {
        this.id = "";
        this.label = "";
        this.description = "";
        this.value = "";
        this.tooltip = "";
        this.command = "";
        this.commandArgs = [];
        this.type = "";
        this.contextValue = "";
        this.callback = null;
        this.icon = null;
        this.children = [];
        this.color = "";
        this.location = "";
        this.name = "";
        this.eventDescription = null;
        this.initialCollapsibleState = vscode_1.TreeItemCollapsibleState.Collapsed;
        this.interactionType = UIInteractionType.Click;
        this.interactionIcon = "";
        this.hideCTAInTracker = false;
    }
}
exports.KpmItem = KpmItem;
class KeystrokeAggregate {
    constructor() {
        this.add = 0;
        this.close = 0;
        this.delete = 0;
        this.linesAdded = 0;
        this.linesRemoved = 0;
        this.open = 0;
        this.paste = 0;
        this.keystrokes = 0;
        this.directory = Constants_1.NO_PROJ_NAME;
    }
}
exports.KeystrokeAggregate = KeystrokeAggregate;
class DocumentChangeInfo {
    constructor() {
        this.linesAdded = 0;
        this.linesDeleted = 0;
        this.charactersAdded = 0;
        this.charactersDeleted = 0;
        this.singleDeletes = 0;
        this.multiDeletes = 0;
        this.singleAdds = 0;
        this.multiAdds = 0;
        this.autoIndents = 0;
        this.replacements = 0;
    }
}
exports.DocumentChangeInfo = DocumentChangeInfo;
class FileChangeInfo {
    constructor() {
        this.name = "";
        this.fsPath = "";
        this.projectDir = "";
        this.kpm = 0;
        this.keystrokes = 0;
        this.add = 0;
        this.netkeys = 0;
        this.paste = 0;
        this.charsPasted = 0;
        this.open = 0;
        this.close = 0;
        this.delete = 0;
        this.length = 0;
        this.lines = 0;
        this.linesAdded = 0;
        this.linesRemoved = 0;
        this.syntax = "";
        this.fileAgeDays = 0;
        this.repoFileContributorCount = 0;
        this.start = 0;
        this.end = 0;
        this.local_start = 0;
        this.local_end = 0;
        this.update_count = 0;
        this.duration_seconds = 0;
        this.documentChangeInfo = new DocumentChangeInfo();
    }
}
exports.FileChangeInfo = FileChangeInfo;
class SessionSummary {
    constructor() {
        this.currentDayMinutes = 0;
        this.currentDayKeystrokes = 0;
        this.currentDayKpm = 0;
        this.currentDayLinesAdded = 0;
        this.currentDayLinesRemoved = 0;
        this.averageDailyMinutes = 0;
        this.averageDailyKeystrokes = 0;
        this.averageDailyKpm = 0;
        this.averageLinesAdded = 0;
        this.averageLinesRemoved = 0;
        this.timePercent = 0;
        this.volumePercent = 0;
        this.velocityPercent = 0;
        this.liveshareMinutes = 0;
        this.latestPayloadTimestampEndUtc = 0;
        this.latestPayloadTimestamp = 0;
        this.lastUpdatedToday = false;
        this.currentSessionGoalPercent = 0;
        this.inFlow = false;
        this.dailyMinutesGoal = 0;
        this.globalAverageSeconds = 0;
        this.globalAverageDailyMinutes = 0;
        this.globalAverageDailyKeystrokes = 0;
        this.globalAverageLinesAdded = 0;
        this.globalAverageLinesRemoved = 0;
    }
}
exports.SessionSummary = SessionSummary;
class LoggedInState {
    constructor() {
        this.loggedIn = false;
    }
}
exports.LoggedInState = LoggedInState;
class CommitChangeStats {
    constructor() {
        this.insertions = 0;
        this.deletions = 0;
        this.fileCount = 0;
        this.commitCount = 0;
    }
}
exports.CommitChangeStats = CommitChangeStats;
// example: {type: "window", name: "close", timestamp: 1234,
// timestamp_local: 1233, description: "OnboardPrompt"}
class CodeTimeEvent {
    constructor() {
        this.type = "";
        this.name = "";
        this.timestamp = 0;
        this.timestamp_local = 0;
        this.description = "";
        this.pluginId = Util_1.getPluginId();
        this.os = Util_1.getOs();
        this.version = Util_1.getVersion();
        this.hostname = ""; // this is gathered using an await
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
}
exports.CodeTimeEvent = CodeTimeEvent;
//# sourceMappingURL=models.js.map