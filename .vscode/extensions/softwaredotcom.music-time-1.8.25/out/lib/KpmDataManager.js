"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("./Util");
class KpmDataManager {
    constructor(project) {
        this.source = {};
        this.keystrokes = 0;
        this.project = project;
        this.pluginId = Util_1.getPluginId();
        this.version = Util_1.getVersion();
        this.os = Util_1.getOs();
        this.repoContributorCount = 0;
        this.repoFileCount = 0;
        this.keystrokes = 0;
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
            // tally the keystrokes for this file
            data.keystrokes = data.add + data.paste + data.delete;
            const hasKeystrokes = data.keystrokes > 0;
            keystrokesTally += data.keystrokes;
            if ((hasOpen && !hasClose && !hasKeystrokes) ||
                (hasClose && !hasOpen && !hasKeystrokes)) {
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
    getLatestPayload() {
        let payload = {};
        try {
            payload = JSON.parse(JSON.stringify(this));
            payload = completePayloadInfo(payload);
        }
        catch (e) {
            //
        }
        return payload;
    }
    /**
     * send the payload
     */
    postData(payload) {
        Util_1.logIt(`storing kpm metrics`);
        Util_1.storePayload(payload);
    }
}
exports.KpmDataManager = KpmDataManager;
function completePayloadInfo(payload) {
    if (payload.source) {
        // set the end time for the session
        let nowTimes = Util_1.getNowTimes();
        payload["end"] = nowTimes.now_in_sec;
        payload["local_end"] = nowTimes.local_now_in_sec;
        const keys = Object.keys(payload.source);
        if (keys && keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                // ensure there is an end time
                const end = parseInt(payload.source[key]["end"], 10) || 0;
                if (end === 0) {
                    // set the end time for this file event
                    let nowTimes = Util_1.getNowTimes();
                    payload.source[key]["end"] = nowTimes.now_in_sec;
                    payload.source[key]["local_end"] = nowTimes.local_now_in_sec;
                }
            }
        }
        payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return payload;
}
exports.completePayloadInfo = completePayloadInfo;
//# sourceMappingURL=KpmDataManager.js.map