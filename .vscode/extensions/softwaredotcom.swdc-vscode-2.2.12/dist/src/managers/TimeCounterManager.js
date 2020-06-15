"use strict";
// Variables to keep track of
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
exports.TimeCounterManager = void 0;
const Util_1 = require("../Util");
const FileManager_1 = require("./FileManager");
const TimeCounterStats_1 = require("../model/TimeCounterStats");
const SessionSummaryData_1 = require("../storage/SessionSummaryData");
const FileChangeInfoSummaryData_1 = require("../storage/FileChangeInfoSummaryData");
const SummaryManager_1 = require("./SummaryManager");
const Constants_1 = require("../Constants");
const KpmRepoManager_1 = require("../repo/KpmRepoManager");
const Project_1 = require("../model/Project");
const PayloadManager_1 = require("./PayloadManager");
const WallClockManager_1 = require("./WallClockManager");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const FIFTEEN_MIN_IN_SECONDS = 60 * 15;
const FIVE_MIN_INTERVAL = 1000 * 60 * 5;
class TimeCounterManager {
    constructor() {
        this.stats = null;
        this.initializeTimeCounterData();
    }
    static getInstance() {
        if (!TimeCounterManager.instance) {
            TimeCounterManager.instance = new TimeCounterManager();
        }
        return TimeCounterManager.instance;
    }
    /**
     * Fetch the data from the timeCounter.json to
     * populate the tiemstamp and seconds values that may
     * have been set from another window or editor
     */
    initializeTimeCounterData() {
        this.stats = Util_1.getFileDataAsJson(Util_1.getTimeCounterFile());
        if (!this.stats) {
            const nowTimes = Util_1.getNowTimes();
            this.stats = new TimeCounterStats_1.default();
            // set the current day (YYYY-MM-DD)
            this.stats.current_day = nowTimes.day;
        }
        // call the focused handler
        this.editorFocusHandler();
        // Initialize the midnight check handler
        setInterval(() => {
            this.midnightCheckHandler();
        }, FIVE_MIN_INTERVAL);
    }
    /**
     * Save all of the updated attributes to the timeCounter.json
     */
    updateFileData() {
        if (this.stats) {
            FileManager_1.storeJsonData(Util_1.getTimeCounterFile(), this.stats);
        }
    }
    /**
     * Step 1) Replace last_focused_timestamp_utc with current time (utc)
     * Step 2) Update the elapsed_time_seconds based on the following condition
        const diff = now - last_unfocused_timestamp_utc;
        if (diff < fifteen_minutes_in_seconds) {
            elapsed_code_time_seconds += diff;
        }
    * Step 3) Clear "last_unfocused_timestamp_utc"
    */
    editorFocusHandler() {
        const nowTimes = Util_1.getNowTimes();
        // Step 1) Replace last_focused_timestamp_utc with current time (utc)
        this.stats.last_focused_timestamp_utc = nowTimes.now_in_sec;
        // update the file
        this.updateFileData();
    }
    /**
     * Step 1) Replace last_unfocused_timestamp_utc
     * Step 2) Update elapsed_code_time_seconds based on the following condition
        const diff = now - last_focused_timestamp_utc;
        if (diff < fifteen_minutes_in_seconds) {
            elapsed_code_time_seconds += diff;
        }
    * Step 3) Clear "last_focused_timestamp_utc"
    */
    editorUnFocusHandler() {
        const nowTimes = Util_1.getNowTimes();
        // Step 1) Replace last_focused_timestamp_utc with current time (utc)
        this.stats.last_unfocused_timestamp_utc = nowTimes.now_in_sec;
        // update the file
        this.updateFileData();
    }
    /**
     * Step 1) Clear "cumulative_code_time_seconds"
     * Step 2) Clear "cumulative_active_code_time_seconds"
     */
    midnightCheckHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimes = Util_1.getNowTimes();
            if (Util_1.isNewDay()) {
                this.stats.cumulative_code_time_seconds = 0;
                this.stats.cumulative_active_code_time_seconds = 0;
                // set the current day
                this.stats.current_day = nowTimes.day;
                // update the file
                this.updateFileData();
                // Clear the session summary data (report and status bar info)
                SessionSummaryData_1.clearSessionSummaryData();
                // send the offline data
                yield FileManager_1.sendOfflineData();
                // clear the last save payload
                FileManager_1.clearLastSavedKeystrokeStats();
                // send the offline TimeData payloads
                yield FileManager_1.sendOfflineTimeData();
                // clear the file change info (metrics shown in the tree)
                FileChangeInfoSummaryData_1.clearFileChangeInfoSummaryData();
                // update the current day
                Util_1.setItem("currentDay", nowTimes.day);
                setTimeout(() => {
                    SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
                }, 5000);
            }
        });
    }
    /**
     * Step 1) Updating the "elapsed_code_time_seconds" one more time based on the following condition
        const diff = now - last_focused_timestamp_utc;
        if (diff < fifteen_minutes_in_seconds) {
            elapsed_code_time_seconds += diff;
        }
        focused_editor_seconds = diff;
    * Step 2) Replace "last_focused_timestamp_utc" with now
    * Step 3) Update "elapsed_seconds" with the following condition
        elapsed_seconds = now - last_payload_end_utc;
    * Step 4) Update "elapsed_active_code_time_seconds" with the following condition
        elapsed_active_code_time_seconds = Math.min(elapsed_seconds, focused_editor_seconds, fifteen_minutes_in_seconds)
    * Step 5) Update "cumulative_code_time_seconds" with the following condition
        cumulative_code_time_seconds += elapsed_code_time_seconds;
    * Step 6) Update "cumulative_active_code_time_seconds" with the following condition
        cumulative_active_code_time_seconds += elapsed_active_code_time_seconds
    * Step 7) Replace "last_payload_end_utc" with now
    * Step 8) Clear "elapsed_code_time_seconds"
    * Step 9) Clear "focused_editor_seconds"
    */
    processPayloadHandler(payload, sendNow) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimes = Util_1.getNowTimes();
            // ensure the payload has the project info
            yield this.populatePayloadProject(payload);
            // make sure all files have an end time
            this.completeFileEndTimes(payload, nowTimes);
            // Get time between payloads
            const { sessionMinutes, elapsedSeconds } = SessionSummaryData_1.getTimeBetweenLastPayload();
            yield this.updateCumulativeSessionTime(payload, sessionMinutes);
            const diff = nowTimes.now_in_sec - this.stats.last_focused_timestamp_utc;
            // Step 1) add to the elapsed code time seconds if its less than 15 min
            if (diff < FIFTEEN_MIN_IN_SECONDS) {
                this.stats.elapsed_code_time_seconds += diff;
            }
            // Step 2) Replace "last_focused_timestamp_utc" with now
            this.stats.last_focused_timestamp_utc = nowTimes.now_in_sec;
            // Step 3) update the elapsed seconds based on the now minus the last payload end time
            this.stats.elapsed_seconds =
                nowTimes.now_in_sec - this.stats.last_payload_end_utc;
            // Step 4) Update "elapsed_active_code_time_seconds"
            this.stats.elapsed_active_code_time_seconds = Math.min(this.stats.elapsed_seconds, this.stats.focused_editor_seconds, FIFTEEN_MIN_IN_SECONDS);
            // Step 5) Update "cumulative_code_time_seconds"
            this.stats.cumulative_code_time_seconds += this.stats.elapsed_code_time_seconds;
            // Step 6) Update "cumulative_active_code_time_seconds"
            this.stats.cumulative_active_code_time_seconds += this.stats.elapsed_active_code_time_seconds;
            // Step 7) Replace "last_payload_end_utc" with now
            this.stats.last_payload_end_utc = nowTimes.now_in_sec;
            // Step 8) Clear "elapsed_code_time_seconds"
            this.stats.elapsed_code_time_seconds = 0;
            // Step 9) Clear "focused_editor_seconds"
            this.stats.focused_editor_seconds = 0;
            // set the following into the payload
            // elapsed_code_time_seconds, elapsed_active_code_time_seconds,
            // cumulative_code_time_seconds, cumulative_active_code_time_seconds
            payload.elapsed_code_time_seconds = this.stats.elapsed_code_time_seconds;
            payload.elapsed_active_code_time_seconds = this.stats.elapsed_active_code_time_seconds;
            payload.cumulative_code_time_seconds = this.stats.cumulative_code_time_seconds;
            payload.cumulative_active_code_time_seconds = this.stats.cumulative_active_code_time_seconds;
            // set the end times
            payload.end = nowTimes.now_in_sec;
            payload.local_end = nowTimes.local_now_in_sec;
            // set the timezone
            payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            // update the aggregation data for the tree info
            this.aggregateFileMetrics(payload, sessionMinutes);
            // async for either
            if (sendNow) {
                // send the payload now (only called when getting installed)
                FileManager_1.sendBatchPayload("/data/batch", [payload]);
                Util_1.logIt(`sending kpm metrics`);
            }
            else {
                // store to send the batch later
                PayloadManager_1.storePayload(payload);
                Util_1.logIt(`storing kpm metrics`);
            }
            // Update the latestPayloadTimestampEndUtc. It's used to determine session time and elapsed_seconds
            Util_1.setItem("latestPayloadTimestampEndUtc", nowTimes.now_in_sec);
            // update the status and tree
            WallClockManager_1.WallClockManager.getInstance().dispatchStatusViewUpdate();
        });
    }
    aggregateFileMetrics(payload, sessionMinutes) {
        return __awaiter(this, void 0, void 0, function* () {
            // get a mapping of the current files
            const fileChangeInfoMap = FileChangeInfoSummaryData_1.getFileChangeSummaryAsJson();
            yield PayloadManager_1.updateAggregateInfo(fileChangeInfoMap, payload, sessionMinutes);
            // write the fileChangeInfoMap
            FileChangeInfoSummaryData_1.saveFileChangeInfoToDisk(fileChangeInfoMap);
        });
    }
    populateRepoMetrics(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.project &&
                payload.project.identifier &&
                payload.project.directory) {
                // REPO contributor count
                const repoContributorInfo = yield KpmRepoManager_1.getRepoContributorInfo(payload.project.directory, true);
                payload.repoContributorCount = repoContributorInfo
                    ? repoContributorInfo.count || 0
                    : 0;
                // REPO file count
                const repoFileCount = yield KpmRepoManager_1.getRepoFileCount(payload.project.directory);
                payload.repoFileCount = repoFileCount || 0;
            }
            else {
                payload.repoContributorCount = 0;
                payload.repoFileCount = 0;
            }
        });
    }
    /**
     * Populate the project information for this specific payload
     * @param payload
     */
    populatePayloadProject(payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
                resourceInfo && resourceInfo.identifier
                    ? resourceInfo.identifier
                    : "";
            payload.project = p;
            yield this.populateRepoMetrics(payload);
        });
    }
    /**
     * Set the end times for the files that didn't get a chance to set the end time
     * @param payload
     * @param nowTimes
     */
    completeFileEndTimes(payload, nowTimes) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(payload.source);
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
                    if (payload.project && payload.project.identifier) {
                        // set the contributor count per file
                        const repoFileContributorCount = yield KpmRepoManager_1.getFileContributorCount(key);
                        fileInfo.repoFileContributorCount =
                            repoFileContributorCount || 0;
                    }
                    payload.source[key] = fileInfo;
                }
            }
        });
    }
    /**
     * This will update the cumulative editor and session seconds.
     * It will also provide any error details if any are encountered.
     * @param payload
     * @param sessionMinutes
     */
    updateCumulativeSessionTime(payload, sessionMinutes) {
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
}
exports.TimeCounterManager = TimeCounterManager;
//# sourceMappingURL=TimeCounterManager.js.map