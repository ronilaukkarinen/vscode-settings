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
const FileChangeInfoSummaryData_1 = require("../storage/FileChangeInfoSummaryData");
const SessionSummaryData_1 = require("../storage/SessionSummaryData");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const HttpClient_1 = require("../http/HttpClient");
const FileManager_1 = require("./FileManager");
// every 1 min
const DAY_CHECK_TIMER_INTERVAL = 1000 * 60;
class SummaryManager {
    constructor() {
        this._dayCheckTimer = null;
        this._currentDay = null;
        this.init();
    }
    static getInstance() {
        if (!SummaryManager.instance) {
            SummaryManager.instance = new SummaryManager();
        }
        return SummaryManager.instance;
    }
    init() {
        // fetch the current day from the sessions.json
        this._currentDay = Util_1.getItem("currentDay");
        // start timer to check if it's a new day or not
        this._dayCheckTimer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            SummaryManager.getInstance().newDayChecker();
        }), DAY_CHECK_TIMER_INTERVAL);
        setTimeout(() => {
            this.newDayChecker();
        }, 1000);
    }
    dispose() {
        if (this._dayCheckTimer) {
            clearInterval(this._dayCheckTimer);
        }
    }
    /**
     * Check if its a new day, if so we'll clear the session sumary and
     * file change info summary, then we'll force a fetch from the app
     */
    newDayChecker() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Util_1.isNewDay()) {
                SessionSummaryData_1.clearSessionSummaryData();
                // send the offline data
                yield FileManager_1.sendOfflineData(true);
                // clear the last save payload
                FileManager_1.clearLastSavedKeystrokeStats();
                // send the offline TimeData payloads
                yield FileManager_1.sendOfflineTimeData();
                // clear the wctime for other plugins that still rely on it
                Util_1.setItem("wctime", 0);
                FileChangeInfoSummaryData_1.clearFileChangeInfoSummaryData();
                // set the current day
                const nowTime = Util_1.getNowTimes();
                this._currentDay = nowTime.day;
                // update the current day
                Util_1.setItem("currentDay", this._currentDay);
                // update the last payload timestamp
                Util_1.setItem("latestPayloadTimestampEndUtc", 0);
                setTimeout(() => {
                    this.updateSessionSummaryFromServer();
                }, 5000);
            }
        });
    }
    /**
     * This is only called from the new day checker
     */
    updateSessionSummaryFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const jwt = Util_1.getItem("jwt");
            const result = yield HttpClient_1.softwareGet(`/sessions/summary?refresh=true`, jwt);
            if (HttpClient_1.isResponseOk(result) && result.data) {
                const data = result.data;
                // update the session summary data
                const summary = SessionSummaryData_1.getSessionSummaryData();
                Object.keys(data).forEach((key) => {
                    const val = data[key];
                    if (val !== null && val !== undefined) {
                        summary[key] = val;
                    }
                });
                // if the summary.currentDayMinutes is greater than the wall
                // clock time then it means the plugin was installed on a
                // different computer or the session was deleted
                TimeSummaryData_1.updateSessionFromSummaryApi(summary.currentDayMinutes);
                SessionSummaryData_1.saveSessionSummaryToDisk(summary);
            }
            SessionSummaryData_1.updateStatusBarWithSummaryData();
        });
    }
}
exports.SummaryManager = SummaryManager;
//# sourceMappingURL=SummaryManager.js.map