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
exports.getStatusBarKpmItem = exports.updateStatusBarWithSummaryData = exports.incrementSessionSummaryData = exports.getTimeBetweenLastPayload = exports.setSessionSummaryLiveshareMinutes = exports.saveSessionSummaryToDisk = exports.getSessionSummaryFileAsJson = exports.getSessionSummaryData = exports.getSessionSummaryFile = exports.clearSessionSummaryData = exports.getSessionThresholdSeconds = void 0;
const models_1 = require("../model/models");
const Util_1 = require("../Util");
const Constants_1 = require("../Constants");
const TimeSummaryData_1 = require("./TimeSummaryData");
const fileIt = require("file-it");
function getSessionThresholdSeconds() {
    const thresholdSeconds = Util_1.getItem("sessionThresholdInSec") || Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
    return thresholdSeconds;
}
exports.getSessionThresholdSeconds = getSessionThresholdSeconds;
function clearSessionSummaryData() {
    const sessionSummaryData = new models_1.SessionSummary();
    saveSessionSummaryToDisk(sessionSummaryData);
}
exports.clearSessionSummaryData = clearSessionSummaryData;
function getSessionSummaryFile() {
    let file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\sessionSummary.json";
    }
    else {
        file += "/sessionSummary.json";
    }
    return file;
}
exports.getSessionSummaryFile = getSessionSummaryFile;
function getSessionSummaryData() {
    let sessionSummaryData = getSessionSummaryFileAsJson();
    // make sure it's a valid structure
    if (!sessionSummaryData) {
        // set the defaults
        sessionSummaryData = new models_1.SessionSummary();
    }
    // fill in missing attributes
    sessionSummaryData = coalesceMissingAttributes(sessionSummaryData);
    return sessionSummaryData;
}
exports.getSessionSummaryData = getSessionSummaryData;
function coalesceMissingAttributes(data) {
    // ensure all attributes are defined
    const template = new models_1.SessionSummary();
    Object.keys(template).forEach((key) => {
        if (!data[key]) {
            data[key] = 0;
        }
    });
    return data;
}
function getSessionSummaryFileAsJson() {
    const file = getSessionSummaryFile();
    let sessionSummary = Util_1.getFileDataAsJson(file);
    if (!sessionSummary) {
        sessionSummary = new models_1.SessionSummary();
        saveSessionSummaryToDisk(sessionSummary);
    }
    return sessionSummary;
}
exports.getSessionSummaryFileAsJson = getSessionSummaryFileAsJson;
function saveSessionSummaryToDisk(sessionSummaryData) {
    const file = getSessionSummaryFile();
    fileIt.writeJsonFileSync(file, sessionSummaryData, { spaces: 4 });
}
exports.saveSessionSummaryToDisk = saveSessionSummaryToDisk;
function setSessionSummaryLiveshareMinutes(minutes) {
    let sessionSummaryData = getSessionSummaryData();
    sessionSummaryData.liveshareMinutes = minutes;
    saveSessionSummaryToDisk(sessionSummaryData);
}
exports.setSessionSummaryLiveshareMinutes = setSessionSummaryLiveshareMinutes;
/**
 * Return {elapsedSeconds, sessionSeconds}
 * The session minutes is based on a threshold of 15 minutes
 */
function getTimeBetweenLastPayload() {
    // default to 1 minute
    let sessionSeconds = 0;
    let elapsedSeconds = 60;
    // will be zero if its a new day
    const lastPayloadEnd = Util_1.getItem("latestPayloadTimestampEndUtc");
    // the last payload end time is reset within the new day checker
    if (lastPayloadEnd && lastPayloadEnd > 0) {
        // diff from the previous end time
        elapsedSeconds = Util_1.coalesceNumber(Util_1.getNowTimes().now_in_sec - lastPayloadEnd);
        // if it's less than the threshold then add the minutes to the session time
        if (elapsedSeconds > 0 &&
            elapsedSeconds <= getSessionThresholdSeconds()) {
            // it's still the same session, add the gap time in minutes
            sessionSeconds = elapsedSeconds;
        }
        sessionSeconds = Util_1.coalesceNumber(sessionSeconds);
    }
    return { sessionSeconds, elapsedSeconds };
}
exports.getTimeBetweenLastPayload = getTimeBetweenLastPayload;
function incrementSessionSummaryData(aggregates, sessionSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        let sessionSummaryData = getSessionSummaryData();
        // fill in missing attributes
        sessionSummaryData = coalesceMissingAttributes(sessionSummaryData);
        // convert to minutes
        const sessionMinutes = sessionSeconds ? sessionSeconds / 60 : 0;
        sessionSummaryData.currentDayMinutes += sessionMinutes;
        // increment the current day attributes except for the current day minutes
        sessionSummaryData.currentDayKeystrokes += aggregates.keystrokes;
        sessionSummaryData.currentDayLinesAdded += aggregates.linesAdded;
        sessionSummaryData.currentDayLinesRemoved += aggregates.linesRemoved;
        saveSessionSummaryToDisk(sessionSummaryData);
    });
}
exports.incrementSessionSummaryData = incrementSessionSummaryData;
/**
 * Updates the status bar text with the current day minutes (session minutes)
 */
function updateStatusBarWithSummaryData() {
    const codeTimeSummary = TimeSummaryData_1.getCodeTimeSummary();
    const data = getSessionSummaryData();
    const averageDailyMinutes = data.averageDailyMinutes;
    // const inFlowIcon = currentDayMinutes > averageDailyMinutes ? "🚀 " : "";
    const inFlowIcon = codeTimeSummary.activeCodeTimeMinutes > averageDailyMinutes
        ? "$(rocket)"
        : "$(clock)";
    const minutesStr = Util_1.humanizeMinutes(codeTimeSummary.activeCodeTimeMinutes);
    const msg = `${inFlowIcon} ${minutesStr}`;
    Util_1.showStatus(msg, null);
}
exports.updateStatusBarWithSummaryData = updateStatusBarWithSummaryData;
function getStatusBarKpmItem() {
    const item = new models_1.KpmItem();
    item.name = "ct_status_bar_metrics_btn";
    item.description = "status bar metrics";
    item.location = "ct_status_bar";
    item.color = null;
    item.interactionIcon = "clock";
    return item;
}
exports.getStatusBarKpmItem = getStatusBarKpmItem;
//# sourceMappingURL=SessionSummaryData.js.map