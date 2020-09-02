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
exports.getTodayTimeDataSummary = exports.getCodeTimeSummary = exports.incrementSessionAndFileSecondsAndFetch = exports.updateSessionFromSummaryApi = exports.incrementEditorSeconds = exports.getCurrentTimeSummaryProject = exports.clearTimeDataSummary = exports.getTimeDataSummaryFile = void 0;
const Util_1 = require("../Util");
const KpmRepoManager_1 = require("../repo/KpmRepoManager");
const Constants_1 = require("../Constants");
const CodeTimeSummary_1 = require("../model/CodeTimeSummary");
const Project_1 = require("../model/Project");
const TimeData_1 = require("../model/TimeData");
const fileIt = require("file-it");
const moment = require("moment-timezone");
function getTimeDataSummaryFile() {
    let file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\projectTimeData.json";
    }
    else {
        file += "/projectTimeData.json";
    }
    return file;
}
exports.getTimeDataSummaryFile = getTimeDataSummaryFile;
/**
 * Build a new TimeData summary
 * @param project
 */
function getNewTimeDataSummary(project) {
    return __awaiter(this, void 0, void 0, function* () {
        const { day } = Util_1.getNowTimes();
        let timeData = null;
        if (!project) {
            const activeWorkspace = Util_1.getActiveProjectWorkspace();
            project = yield getCurrentTimeSummaryProject(activeWorkspace);
            // but make sure we're not creating a new one on top of one that already exists
            timeData = findTimeDataSummary(project);
            if (timeData) {
                return timeData;
            }
        }
        // still unable to find an existing td, create a new one
        timeData = new TimeData_1.default();
        timeData.day = day;
        timeData.project = project;
        return timeData;
    });
}
function clearTimeDataSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const file = getTimeDataSummaryFile();
        let payloads = [];
        fileIt.writeJsonFileSync(file, payloads, { spaces: 4 });
    });
}
exports.clearTimeDataSummary = clearTimeDataSummary;
function getCurrentTimeSummaryProject(workspaceFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = new Project_1.default();
        if (!workspaceFolder || !workspaceFolder.name) {
            // no workspace folder
            project.directory = Constants_1.UNTITLED;
            project.name = Constants_1.NO_PROJ_NAME;
        }
        else {
            let rootPath = workspaceFolder.uri.fsPath;
            let name = workspaceFolder.name;
            if (rootPath) {
                // create the project
                project.directory = rootPath;
                project.name = name;
                try {
                    const resource = yield KpmRepoManager_1.getResourceInfo(rootPath);
                    if (resource) {
                        project.resource = resource;
                        project.identifier = resource.identifier;
                    }
                }
                catch (e) {
                    //
                }
            }
        }
        return project;
    });
}
exports.getCurrentTimeSummaryProject = getCurrentTimeSummaryProject;
function incrementEditorSeconds(editor_seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeWorkspace = Util_1.getActiveProjectWorkspace();
        // only increment if we have an active workspace
        if (activeWorkspace && activeWorkspace.name) {
            const project = yield getCurrentTimeSummaryProject(activeWorkspace);
            if (project && project.directory) {
                const timeData = yield getTodayTimeDataSummary(project);
                timeData.editor_seconds += editor_seconds;
                timeData.editor_seconds = Math.max(timeData.editor_seconds, timeData.session_seconds);
                // save the info to disk
                saveTimeDataSummaryToDisk(timeData);
            }
        }
    });
}
exports.incrementEditorSeconds = incrementEditorSeconds;
function updateSessionFromSummaryApi(currentDayMinutes) {
    return __awaiter(this, void 0, void 0, function* () {
        const { day } = Util_1.getNowTimes();
        const codeTimeSummary = getCodeTimeSummary();
        // find out if there's a diff
        const diffActiveCodeMinutesToAdd = codeTimeSummary.activeCodeTimeMinutes < currentDayMinutes
            ? currentDayMinutes - codeTimeSummary.activeCodeTimeMinutes
            : 0;
        // get the current open project
        const activeWorkspace = Util_1.getActiveProjectWorkspace();
        let project = null;
        let timeData = null;
        if (activeWorkspace) {
            project = yield getCurrentTimeSummaryProject(activeWorkspace);
            timeData = yield getTodayTimeDataSummary(project);
        }
        else {
            const file = getTimeDataSummaryFile();
            const payloads = Util_1.getFileDataArray(file);
            const filtered_payloads = payloads.filter((n) => n.day === day);
            if (filtered_payloads && filtered_payloads.length) {
                timeData = filtered_payloads[0];
            }
        }
        if (!timeData) {
            // create a untitled one
            project = new Project_1.default();
            project.directory = Constants_1.UNTITLED;
            project.name = Constants_1.NO_PROJ_NAME;
            timeData = new TimeData_1.default();
            timeData.day = day;
            timeData.project = project;
        }
        // save the info to disk
        const secondsToAdd = diffActiveCodeMinutesToAdd * 60;
        timeData.session_seconds += secondsToAdd;
        timeData.editor_seconds += secondsToAdd;
        // make sure editor seconds isn't less
        saveTimeDataSummaryToDisk(timeData);
    });
}
exports.updateSessionFromSummaryApi = updateSessionFromSummaryApi;
function incrementSessionAndFileSecondsAndFetch(project, sessionSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        // get the matching time data object or create one
        const timeData = yield getTodayTimeDataSummary(project);
        if (timeData) {
            const session_seconds = sessionSeconds;
            timeData.session_seconds += session_seconds;
            // max editor seconds should be equal or greater than session seconds
            timeData.editor_seconds = Math.max(timeData.editor_seconds, timeData.session_seconds);
            timeData.file_seconds += 60;
            // max file seconds should not be greater than session seconds
            timeData.file_seconds = Math.min(timeData.file_seconds, timeData.session_seconds);
            // save the info to disk (synchronous)
            saveTimeDataSummaryToDisk(timeData);
            return timeData;
        }
        return null;
    });
}
exports.incrementSessionAndFileSecondsAndFetch = incrementSessionAndFileSecondsAndFetch;
function getCodeTimeSummary() {
    const summary = new CodeTimeSummary_1.default();
    const { day } = Util_1.getNowTimes();
    // gather the time data elements for today
    const file = getTimeDataSummaryFile();
    const payloads = Util_1.getFileDataArray(file);
    const filtered_payloads = payloads.filter((n) => n.day === day);
    if (filtered_payloads && filtered_payloads.length) {
        filtered_payloads.forEach((n) => {
            summary.activeCodeTimeMinutes += n.session_seconds / 60;
            summary.codeTimeMinutes += n.editor_seconds / 60;
            summary.fileTimeMinutes += n.file_seconds / 60;
        });
    }
    return summary;
}
exports.getCodeTimeSummary = getCodeTimeSummary;
function getTodayTimeDataSummary(project) {
    return __awaiter(this, void 0, void 0, function* () {
        let timeData = findTimeDataSummary(project);
        // not found, create one since we passed the non-null project and dir
        if (!timeData) {
            timeData = yield getNewTimeDataSummary(project);
            saveTimeDataSummaryToDisk(timeData);
        }
        return timeData;
    });
}
exports.getTodayTimeDataSummary = getTodayTimeDataSummary;
function findTimeDataSummary(project) {
    if (!project || !project.directory) {
        // no project or directory, it shouldn't exist in the file
        return null;
    }
    const { day } = Util_1.getNowTimes();
    let timeData = null;
    const file = getTimeDataSummaryFile();
    const payloads = Util_1.getFileDataArray(file);
    if (payloads && payloads.length) {
        // find the one for this day
        timeData = payloads.find((n) => n.day === day && n.project.directory === project.directory);
    }
    return timeData;
}
function saveTimeDataSummaryToDisk(data) {
    if (!data) {
        return;
    }
    const file = getTimeDataSummaryFile();
    let payloads = Util_1.getFileDataArray(file);
    if (payloads && payloads.length) {
        // find the one for this day
        const idx = payloads.findIndex((n) => n.day === data.day &&
            n.project.directory === data.project.directory);
        if (idx !== -1) {
            payloads[idx] = data;
        }
        else {
            // add it
            payloads.push(data);
        }
    }
    else {
        payloads = [data];
    }
    fileIt.writeJsonFileSync(file, payloads, { spaces: 4 });
}
//# sourceMappingURL=TimeSummaryData.js.map