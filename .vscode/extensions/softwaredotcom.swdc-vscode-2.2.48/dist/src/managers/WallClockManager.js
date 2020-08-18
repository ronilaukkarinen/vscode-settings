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
exports.WallClockManager = void 0;
const Util_1 = require("../Util");
const vscode_1 = require("vscode");
const SessionSummaryData_1 = require("../storage/SessionSummaryData");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const KpmManager_1 = require("./KpmManager");
const SECONDS_INTERVAL = 30;
const CLOCK_INTERVAL = 1000 * SECONDS_INTERVAL;
let clock_mgr_interval = null;
class WallClockManager {
    constructor() {
        this._wctime = 0;
        this.initTimer();
    }
    static getInstance() {
        if (!WallClockManager.instance) {
            WallClockManager.instance = new WallClockManager();
        }
        return WallClockManager.instance;
    }
    dispose() {
        clearInterval(clock_mgr_interval);
    }
    initTimer() {
        const kpmMgr = KpmManager_1.KpmManager.getInstance();
        this._wctime = Util_1.getItem("wctime") || 0;
        clock_mgr_interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            // If the window is focused or we have in-memory keystroke data
            if (vscode_1.window.state.focused || kpmMgr.hasKeystrokeData()) {
                // set the wctime (deprecated, remove one day when all plugins use time data info)
                this._wctime = Util_1.getItem("wctime");
                if (!this._wctime || isNaN(this._wctime)) {
                    this._wctime = 0;
                }
                this._wctime += SECONDS_INTERVAL;
                Util_1.setItem("wctime", this._wctime);
                // update the file info file
                TimeSummaryData_1.incrementEditorSeconds(SECONDS_INTERVAL);
            }
            // dispatch to the various views (statusbar and treeview)
            this.dispatchStatusViewUpdate();
        }), CLOCK_INTERVAL);
    }
    dispatchStatusViewUpdate() {
        // update the status bar
        SessionSummaryData_1.updateStatusBarWithSummaryData();
        // update the code time metrics tree views
        vscode_1.commands.executeCommand("codetime.refreshKpmTree");
    }
    getHumanizedWcTime() {
        return Util_1.humanizeMinutes(this._wctime / 60);
    }
    getWcTimeInSeconds() {
        return this._wctime;
    }
}
exports.WallClockManager = WallClockManager;
//# sourceMappingURL=WallClockManager.js.map