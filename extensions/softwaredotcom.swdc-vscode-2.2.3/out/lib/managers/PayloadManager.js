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
const Util_1 = require("../Util");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const FileChangeInfoSummaryData_1 = require("../storage/FileChangeInfoSummaryData");
const models_1 = require("../model/models");
const Constants_1 = require("../Constants");
const SessionSummaryData_1 = require("../storage/SessionSummaryData");
const KpmRepoManager_1 = require("../repo/KpmRepoManager");
const SummaryManager_1 = require("./SummaryManager");
const FileManager_1 = require("./FileManager");
const WallClockManager_1 = require("./WallClockManager");
const Project_1 = require("../model/Project");
const os = require("os");
const fs = require("fs");
const path = require("path");
/**
 * This will update the cumulative editor and session seconds.
 * It will also provide any error details if any are encountered.
 * @param payload
 * @param sessionMinutes
 */
function validateAndUpdateCumulativeData(payload, sessionMinutes) {
    return __awaiter(this, void 0, void 0, function* () {
        // increment the projects session and file seconds
        // This will find a time data object based on the current day
        let td = yield TimeSummaryData_1.incrementSessionAndFileSecondsAndFetch(payload.project, sessionMinutes);
        // default error to empty
        payload.project_null_error = "";
        // get the latest payload (in-memory or on file)
        let lastPayload = yield FileManager_1.getLastSavedKeystrokesStats();
        // check to see if we're in a new day
        if (Util_1.isNewDay()) {
            lastPayload = null;
            if (td) {
                // don't rely on the previous TimeData
                td = null;
                payload.project_null_error = `TimeData should be null as its a new day`;
            }
            yield SummaryManager_1.SummaryManager.getInstance().newDayChecker();
        }
        // set the workspace name
        payload.workspace_name = Util_1.getWorkspaceName();
        payload.hostname = yield Util_1.getHostname();
        // set the project null error if we're unable to find the time project metrics for this payload
        if (!td) {
            // We don't have a TimeData value, use the last recorded kpm data
            payload.project_null_error = `No TimeData for: ${payload.project.directory}`;
        }
        // get the editor seconds
        let cumulative_editor_seconds = 60;
        let cumulative_session_seconds = 60;
        if (td) {
            // We found a TimeData object, use that info
            cumulative_editor_seconds = td.editor_seconds;
            cumulative_session_seconds = td.session_seconds;
        }
        else if (lastPayload) {
            // use the last saved keystrokestats
            if (lastPayload.cumulative_editor_seconds) {
                cumulative_editor_seconds =
                    lastPayload.cumulative_editor_seconds + 60;
            }
            if (lastPayload.cumulative_session_seconds) {
                cumulative_session_seconds =
                    lastPayload.cumulative_session_seconds + 60;
            }
        }
        // Check if the final cumulative editor seconds is less than the cumulative session seconds
        if (cumulative_editor_seconds < cumulative_session_seconds) {
            // make sure to set it to at least the session seconds
            cumulative_editor_seconds = cumulative_session_seconds;
        }
        // update the cumulative editor seconds
        payload.cumulative_editor_seconds = cumulative_editor_seconds;
        payload.cumulative_session_seconds = cumulative_session_seconds;
    });
}
function processPayload(payload, sendNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // set the end time for the session
        let nowTimes = Util_1.getNowTimes();
        // Get time between payloads
        const { sessionMinutes, elapsedSeconds } = SessionSummaryData_1.getTimeBetweenLastPayload();
        // GET the project
        // find the best workspace root directory from the files within the payload
        const keys = Object.keys(payload.source);
        let directory = Constants_1.UNTITLED;
        let projName = Constants_1.NO_PROJ_NAME;
        let resourceInfo = null;
        for (let i = 0; i < keys.length; i++) {
            const fileName = keys[i];
            const workspaceFolder = Util_1.getProjectFolder(fileName);
            if (workspaceFolder) {
                directory = workspaceFolder.uri.fsPath;
                projName = workspaceFolder.name;
                // since we have this, look for the repo identifier
                resourceInfo = yield KpmRepoManager_1.getResourceInfo(directory);
                break;
            }
        }
        // CREATE the project into the payload
        const p = new Project_1.default();
        p.directory = directory;
        p.name = projName;
        p.resource = resourceInfo;
        p.identifier =
            resourceInfo && resourceInfo.identifier ? resourceInfo.identifier : "";
        payload.project = p;
        // validate the cumulative data
        yield validateAndUpdateCumulativeData(payload, sessionMinutes);
        payload.end = nowTimes.now_in_sec;
        payload.local_end = nowTimes.local_now_in_sec;
        if (p.identifier) {
            // REPO contributor count
            const repoContributorInfo = yield KpmRepoManager_1.getRepoContributorInfo(directory, true);
            payload.repoContributorCount = repoContributorInfo
                ? repoContributorInfo.count || 0
                : 0;
            // REPO file count
            const repoFileCount = yield KpmRepoManager_1.getRepoFileCount(directory);
            payload.repoFileCount = repoFileCount || 0;
        }
        else {
            payload.repoContributorCount = 0;
            payload.repoFileCount = 0;
        }
        // set the elapsed seconds (last end time to this end time)
        payload.elapsed_seconds = elapsedSeconds;
        // go through each file and make sure the end time is set
        if (keys && keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const fileInfo = payload.source[key];
                // ensure there is an end time
                if (!fileInfo.end) {
                    fileInfo.end = nowTimes.now_in_sec;
                    fileInfo.local_end = nowTimes.local_now_in_sec;
                }
                // only get the contributor info if we have a repo identifier
                if (p.identifier) {
                    // set the contributor count per file
                    const repoFileContributorCount = yield KpmRepoManager_1.getFileContributorCount(key);
                    fileInfo.repoFileContributorCount =
                        repoFileContributorCount || 0;
                }
                payload.source[key] = fileInfo;
            }
        }
        // set the timezone
        payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // async for either
        if (sendNow) {
            // send the payload now (only called when getting installed)
            FileManager_1.sendBatchPayload("/data/batch", [payload]);
            Util_1.logIt(`sending kpm metrics`);
        }
        else {
            // store to send the batch later
            storePayload(payload, sessionMinutes);
            Util_1.logIt(`storing kpm metrics`);
        }
        // Update the latestPayloadTimestampEndUtc. It's used to determine session time and elapsed_seconds
        Util_1.setItem("latestPayloadTimestampEndUtc", nowTimes.now_in_sec);
    });
}
exports.processPayload = processPayload;
/**
 * this should only be called if there's file data in the source
 * @param payload
 */
function storePayload(payload, sessionMinutes) {
    return __awaiter(this, void 0, void 0, function* () {
        // get a mapping of the current files
        const fileChangeInfoMap = FileChangeInfoSummaryData_1.getFileChangeSummaryAsJson();
        yield updateAggregateInfo(fileChangeInfoMap, payload, sessionMinutes);
        // write the fileChangeInfoMap
        FileChangeInfoSummaryData_1.saveFileChangeInfoToDisk(fileChangeInfoMap);
        // store the payload into the data.json file
        fs.appendFileSync(Util_1.getSoftwareDataStoreFile(), JSON.stringify(payload) + os.EOL, (err) => {
            if (err)
                Util_1.logIt(`Error appending to the Software data store file: ${err.message}`);
        });
        // update the status and tree
        WallClockManager_1.WallClockManager.getInstance().dispatchStatusViewUpdate();
    });
}
exports.storePayload = storePayload;
function updateAggregateInfo(fileChangeInfoMap, payload, sessionMinutes) {
    return __awaiter(this, void 0, void 0, function* () {
        const aggregate = new models_1.KeystrokeAggregate();
        aggregate.directory = payload.project
            ? payload.project.directory || Constants_1.NO_PROJ_NAME
            : Constants_1.NO_PROJ_NAME;
        Object.keys(payload.source).forEach((key) => {
            const fileInfo = payload.source[key];
            /**
             * update the project info
             * project has {directory, name}
             */
            const baseName = path.basename(key);
            fileInfo.name = baseName;
            fileInfo.fsPath = key;
            fileInfo.projectDir = payload.project.directory;
            fileInfo.duration_seconds = fileInfo.end - fileInfo.start;
            // update the aggregate info
            aggregate.add += fileInfo.add;
            aggregate.close += fileInfo.close;
            aggregate.delete += fileInfo.delete;
            aggregate.keystrokes += fileInfo.keystrokes;
            aggregate.linesAdded += fileInfo.linesAdded;
            aggregate.linesRemoved += fileInfo.linesRemoved;
            aggregate.open += fileInfo.open;
            aggregate.paste += fileInfo.paste;
            const existingFileInfo = fileChangeInfoMap[key];
            if (!existingFileInfo) {
                fileInfo.update_count = 1;
                fileInfo.kpm = aggregate.keystrokes;
                fileChangeInfoMap[key] = fileInfo;
            }
            else {
                // aggregate
                existingFileInfo.update_count += 1;
                existingFileInfo.keystrokes += fileInfo.keystrokes;
                existingFileInfo.kpm =
                    existingFileInfo.keystrokes / existingFileInfo.update_count;
                existingFileInfo.add += fileInfo.add;
                existingFileInfo.close += fileInfo.close;
                existingFileInfo.delete += fileInfo.delete;
                existingFileInfo.keystrokes += fileInfo.keystrokes;
                existingFileInfo.linesAdded += fileInfo.linesAdded;
                existingFileInfo.linesRemoved += fileInfo.linesRemoved;
                existingFileInfo.open += fileInfo.open;
                existingFileInfo.paste += fileInfo.paste;
                existingFileInfo.duration_seconds += fileInfo.duration_seconds;
                // non aggregates, just set
                existingFileInfo.lines = fileInfo.lines;
                existingFileInfo.length = fileInfo.length;
            }
        });
        // this will increment and store it offline
        yield SessionSummaryData_1.incrementSessionSummaryData(aggregate, sessionMinutes);
    });
}
exports.updateAggregateInfo = updateAggregateInfo;
//# sourceMappingURL=PayloadManager.js.map