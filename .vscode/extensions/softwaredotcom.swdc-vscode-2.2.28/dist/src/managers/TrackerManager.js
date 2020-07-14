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
exports.TrackerManager = void 0;
const swdc_tracker_1 = require("swdc-tracker");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const UIElement_1 = require("../model/UIElement");
const moment = require("moment-timezone");
class TrackerManager {
    constructor() {
        this.trackerReady = false;
    }
    static getInstance() {
        if (!TrackerManager.instance) {
            TrackerManager.instance = new TrackerManager();
        }
        return TrackerManager.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const pluginName = Util_1.getPluginName();
            // initialize tracker with swdc api host, namespace, and appId
            const result = yield swdc_tracker_1.default.initialize(Constants_1.api_endpoint, "CodeTime", pluginName);
            if (result.status === 200) {
                this.trackerReady = true;
            }
        });
    }
    /**
     * @param type execute_command | click
     * @param ui_element {element_name, element_location, color, icon_name, cta_text}
     */
    trackUIInteraction(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.trackerReady) {
                return;
            }
            const ui_element = UIElement_1.default.transformKpmItemToUIElement(item);
            const baseInfo = this.getBaseTrackerInfo();
            if (!baseInfo.jwt) {
                return;
            }
            const e = Object.assign(Object.assign({ interaction_type: item.interactionType }, ui_element), baseInfo);
            // send the editor action
            swdc_tracker_1.default.trackUIInteraction(e);
        });
    }
    trackEditorAction(type, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.trackerReady) {
                return;
            }
            const baseInfo = this.getBaseTrackerInfo();
            if (!baseInfo.jwt) {
                return;
            }
            const e = Object.assign({ entity: "editor", type,
                name,
                description }, baseInfo);
            // send the 
            swdc_tracker_1.default.trackEditorAction(e);
        });
    }
    getBaseTrackerInfo() {
        const jwt = Util_1.getItem("jwt");
        const local = moment().local();
        const tz_offset_minutes = moment.parseZone(local).utcOffset();
        const workspaceFolders = Util_1.getWorkspaceFolders();
        const project_directory = (workspaceFolders.length) ? workspaceFolders[0].uri.fsPath : "";
        const project_name = (workspaceFolders.length) ? workspaceFolders[0].name : "";
        // if the jwt is null, just set it to null so the
        // caller can key off of the baseInfo.jwt to determine if
        // it should be sent or not
        const token = jwt ? jwt.split("JWT ")[1] : null;
        const baseInfo = {
            jwt: token,
            tz_offset_minutes,
            project_directory,
            project_name,
            plugin_id: Util_1.getPluginId(),
            plugin_name: Util_1.getPluginName(),
            plugin_version: Util_1.getVersion()
        };
        return baseInfo;
    }
}
exports.TrackerManager = TrackerManager;
//# sourceMappingURL=TrackerManager.js.map