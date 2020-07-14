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
const Util_1 = require("./Util");
const Constants_1 = require("./Constants");
const fileIt = require("file-it");
/**
 * {
    "currentDayMinutes": 2,
    "averageDailyMinutes": 1.516144578313253,
    "averageDailyKeystrokes": 280.07014725568945,
    "currentDayKeystrokes": 49,
    "liveshareMinutes": null
    }
*/
let sessionSummaryData = {
    currentDayMinutes: 0,
    averageDailyMinutes: 0,
    averageDailyKeystrokes: 0,
    currentDayKeystrokes: 0,
    liveshareMinutes: null,
    lastStart: null,
};
function clearSessionSummaryData() {
    sessionSummaryData = {
        currentDayMinutes: 0,
        averageDailyMinutes: 0,
        averageDailyKeystrokes: 0,
        currentDayKeystrokes: 0,
        liveshareMinutes: null,
        lastStart: null,
    };
    saveSessionSummaryToDisk(sessionSummaryData);
}
exports.clearSessionSummaryData = clearSessionSummaryData;
function setSessionSummaryLiveshareMinutes(minutes) {
    sessionSummaryData.liveshareMinutes = minutes;
}
exports.setSessionSummaryLiveshareMinutes = setSessionSummaryLiveshareMinutes;
function getSessionThresholdSeconds() {
    const thresholdSeconds = Util_1.getItem("sessionThresholdInSec") || Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
    return thresholdSeconds;
}
exports.getSessionThresholdSeconds = getSessionThresholdSeconds;
function incrementSessionSummaryData(keystrokes) {
    // what is the gap from the previous start
    const nowTimes = Util_1.getNowTimes();
    const nowInSec = nowTimes.now_in_sec;
    let incrementMinutes = 1;
    if (sessionSummaryData.lastStart) {
        const lastStart = parseInt(sessionSummaryData.lastStart, 10);
        // get the diff from the prev start
        const diffInSec = nowInSec - lastStart;
        // If it's less or equal to the session threshold seconds
        // then add to the minutes increment. But check if it's a positive
        // number in case the system clock has been moved to the future
        if (diffInSec > 0 && diffInSec <= getSessionThresholdSeconds()) {
            // it's still the same session, add the gap time in minutes
            const diffInMin = diffInSec / 60;
            incrementMinutes += diffInMin;
        }
    }
    sessionSummaryData.currentDayMinutes += incrementMinutes;
    sessionSummaryData.currentDayKeystrokes += keystrokes;
    sessionSummaryData.lastStart = nowInSec;
    saveSessionSummaryToDisk(sessionSummaryData);
}
exports.incrementSessionSummaryData = incrementSessionSummaryData;
function getSessionSummaryData() {
    return sessionSummaryData;
}
exports.getSessionSummaryData = getSessionSummaryData;
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
function saveSessionSummaryToDisk(sessionSummaryData) {
    fileIt.writeJsonFileSync(getSessionSummaryFile(), sessionSummaryData, { spaces: 4 });
}
exports.saveSessionSummaryToDisk = saveSessionSummaryToDisk;
function getSessionSummaryFileAsJson() {
    let data = fileIt.readJsonFileSync(getSessionSummaryFile());
    return data ? data : {};
}
exports.getSessionSummaryFileAsJson = getSessionSummaryFileAsJson;
/**
 * Fetch the data rows of a given file
 * @param file
 */
function getDataRows(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const payloads = fileIt.readJsonLinesSync(file);
        return payloads;
    });
}
exports.getDataRows = getDataRows;
function getCurrentPayloadFile() {
    let file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\latestKeystrokes.json";
    }
    else {
        file += "/latestKeystrokes.json";
    }
    return file;
}
exports.getCurrentPayloadFile = getCurrentPayloadFile;
function getCurrentPayload() {
    let data = fileIt.readJsonFileSync(getCurrentPayloadFile());
    return data ? data : {};
}
exports.getCurrentPayload = getCurrentPayload;
//# sourceMappingURL=OfflineManager.js.map