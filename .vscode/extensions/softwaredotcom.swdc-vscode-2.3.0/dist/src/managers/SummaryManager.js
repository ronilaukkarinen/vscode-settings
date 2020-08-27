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
exports.SummaryManager = void 0;
const Util_1 = require("../Util");
const SessionSummaryData_1 = require("../storage/SessionSummaryData");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const HttpClient_1 = require("../http/HttpClient");
// every 1 min
const DAY_CHECK_TIMER_INTERVAL = 1000 * 60;
class SummaryManager {
    constructor() {
        //
    }
    static getInstance() {
        if (!SummaryManager.instance) {
            SummaryManager.instance = new SummaryManager();
        }
        return SummaryManager.instance;
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