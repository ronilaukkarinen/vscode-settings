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
const PluginDataManager_1 = require("../managers/PluginDataManager");
class KeystrokeStats {
    constructor(project) {
        this.keystrokes = 0;
        this.start = 0;
        this.local_start = 0;
        this.end = 0;
        this.local_end = 0;
        this.cumulative_editor_seconds = 0;
        this.cumulative_session_seconds = 0;
        this.elapsed_seconds = 0;
        this.workspace_name = "";
        this.hostname = "";
        this.project_null_error = "";
        // new as of 6/10/2020
        this.elapsed_code_time_seconds = 0;
        this.elapsed_active_code_time_seconds = 0;
        this.cumulative_code_time_seconds = 0;
        this.cumulative_active_code_time_seconds = 0;
        this.source = {};
        this.keystrokes = 0;
        this.project = project;
        this.pluginId = Util_1.getPluginId();
        this.version = Util_1.getVersion();
        this.os = Util_1.getOs();
        this.repoContributorCount = 0;
        this.repoFileCount = 0;
        this.keystrokes = 0;
        this.cumulative_editor_seconds = 0;
        this.cumulative_session_seconds = 0;
        this.elapsed_seconds = 0;
        this.project_null_error = "";
        this.hostname = "";
        this.workspace_name = "";
    }
    getCurrentStatsData() {
        return JSON.parse(JSON.stringify(this));
    }
    /**
     * check if the payload should be sent or not
     */
    hasData() {
        const keys = Object.keys(this.source);
        if (!keys || keys.length === 0) {
            return false;
        }
        // delete files that don't have any kpm data
        let foundKpmData = false;
        if (this.keystrokes > 0) {
            foundKpmData = true;
        }
        // Now remove files that don't have any keystrokes that only
        // have an open or close associated with them. If they have
        // open AND close then it's ok, keep it.
        let keystrokesTally = 0;
        keys.forEach((key) => {
            const data = this.source[key];
            const hasOpen = data.open > 0;
            const hasClose = data.close > 0;
            const hasKeystrokes = data.keystrokes > 0;
            keystrokesTally += data.keystrokes;
            if ((hasOpen && !hasClose && !hasKeystrokes) || (hasClose && !hasOpen && !hasKeystrokes)) {
                // delete it, no keystrokes and only an open
                delete this.source[key];
            }
            else if (!foundKpmData && hasOpen && hasClose) {
                foundKpmData = true;
            }
        });
        if (keystrokesTally > 0 && keystrokesTally !== this.keystrokes) {
            // use the keystrokes tally
            foundKpmData = true;
            this.keystrokes = keystrokesTally;
        }
        return foundKpmData;
    }
    /**
     * send the payload
     */
    postData(sendNow = false, isUnfocus = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // create the now times in case it's the secondary window and we have to wait
            const nowTimes = Util_1.getNowTimes();
            PluginDataManager_1.PluginDataManager.getInstance().processPayloadHandler(this, sendNow, nowTimes, isUnfocus);
        });
    }
}
exports.default = KeystrokeStats;
//# sourceMappingURL=KeystrokeStats.js.map