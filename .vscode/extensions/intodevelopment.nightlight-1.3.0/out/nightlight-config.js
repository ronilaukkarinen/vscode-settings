"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const date_util_1 = require("./util/date.util");
class NightlightConfig {
    constructor() {
        this.nightTheme = "Default Dark+";
        this.nightIconTheme = "vs-minimal";
        this.dayTheme = "Default Light+";
        this.dayIconTheme = "vs-minimal";
        this.dayTimeStart = new Date("1970-01-01 10:00");
        this.dayTimeEnd = new Date("1970-01-01 21:00");
        this.gpsLong = null;
        this.gpsLat = null;
        this.overrideUntil = null;
    }
    static load() {
        let config = new NightlightConfig();
        config.nightTheme = vscode.workspace.getConfiguration('nightlight').get('nightTheme') || config.nightTheme;
        config.nightIconTheme = vscode.workspace.getConfiguration('nightlight').get('nightIconTheme') || vscode.workspace.getConfiguration('workbench').get('iconTheme') || config.nightIconTheme;
        config.dayTheme = vscode.workspace.getConfiguration('nightlight').get('dayTheme') || config.dayTheme;
        config.dayIconTheme = vscode.workspace.getConfiguration('nightlight').get('dayIconTheme') || vscode.workspace.getConfiguration('workbench').get('iconTheme') || config.dayIconTheme;
        let configDayTimeStart = date_util_1.DateUtil.parseTime(vscode.workspace.getConfiguration('nightlight').get('dayTimeStart'));
        config.dayTimeStart = configDayTimeStart !== null ? configDayTimeStart : config.dayTimeStart;
        let configDayTimeEnd = date_util_1.DateUtil.parseTime(vscode.workspace.getConfiguration('nightlight').get('dayTimeEnd'));
        config.dayTimeEnd = configDayTimeEnd !== null ? configDayTimeEnd : config.dayTimeEnd;
        config.gpsLong = vscode.workspace.getConfiguration('nightlight').get('gpsLong') || config.gpsLong;
        config.gpsLat = vscode.workspace.getConfiguration('nightlight').get('gpsLat') || config.gpsLat;
        config.overrideUntil = new Date(vscode.workspace.getConfiguration('nightlight').get('overrideUntil')) || config.overrideUntil;
        return config;
    }
    save() {
        vscode.workspace.getConfiguration('nightlight').update('overrideUntil', this.overrideUntil, vscode.ConfigurationTarget.Global);
    }
}
exports.NightlightConfig = NightlightConfig;
//# sourceMappingURL=nightlight-config.js.map