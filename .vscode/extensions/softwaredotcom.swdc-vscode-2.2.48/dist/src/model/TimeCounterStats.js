"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
class TimeCounterStats {
    constructor() {
        this.last_focused_timestamp_utc = 0;
        this.last_unfocused_timestamp_utc = 0;
        this.elapsed_code_time_seconds = 0;
        this.elapsed_active_code_time_seconds = 0;
        this.elapsed_seconds = 0;
        this.focused_editor_seconds = 0;
        this.cumulative_code_time_seconds = 0;
        this.cumulative_active_code_time_seconds = 0;
        this.last_payload_end_utc = 0;
        this.current_day = "";
        const nowTimes = Util_1.getNowTimes();
        // set the current day (YYYY-MM-DD)
        this.current_day = nowTimes.day;
        // set last_payload end and focused timestamp to now (UTC)
        this.last_payload_end_utc = nowTimes.now_in_sec;
        this.last_focused_timestamp_utc = nowTimes.now_in_sec;
    }
}
exports.default = TimeCounterStats;
//# sourceMappingURL=TimeCounterStats.js.map