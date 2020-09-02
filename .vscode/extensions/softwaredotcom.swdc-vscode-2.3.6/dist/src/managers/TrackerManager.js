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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerManager = void 0;
const swdc_tracker_1 = require("swdc-tracker");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const KpmRepoManager_1 = require("../repo/KpmRepoManager");
const GitUtil_1 = require("../repo/GitUtil");
const moment = require("moment-timezone");
class TrackerManager {
    constructor() {
        this.trackerReady = false;
        this.pluginParams = this.getPluginParams();
    }
    static getInstance() {
        if (!TrackerManager.instance) {
            TrackerManager.instance = new TrackerManager();
        }
        return TrackerManager.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // initialize tracker with swdc api host, namespace, and appId
            const result = yield swdc_tracker_1.default.initialize(Constants_1.api_endpoint, "CodeTime", "swdc-vscode");
            if (result.status === 200) {
                this.trackerReady = true;
            }
        });
    }
    trackCodeTimeEvent(keystrokeStats) {
        var e_1, _a;
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.trackerReady) {
                return;
            }
            // extract the project info from the keystroke stats
            const projectInfo = {
                project_directory: keystrokeStats.project.directory,
                project_name: keystrokeStats.project.name,
            };
            // loop through the files in the keystroke stats "source"
            const fileKeys = Object.keys(keystrokeStats.source);
            try {
                for (var fileKeys_1 = __asyncValues(fileKeys), fileKeys_1_1; fileKeys_1_1 = yield fileKeys_1.next(), !fileKeys_1_1.done;) {
                    let file = fileKeys_1_1.value;
                    const fileData = keystrokeStats.source[file];
                    const codetime_entity = {
                        keystrokes: fileData.keystrokes,
                        lines_added: fileData.documentChangeInfo.linesAdded,
                        lines_deleted: fileData.documentChangeInfo.linesDeleted,
                        characters_added: fileData.documentChangeInfo.charactersAdded,
                        characters_deleted: fileData.documentChangeInfo.charactersDeleted,
                        single_deletes: fileData.documentChangeInfo.singleDeletes,
                        multi_deletes: fileData.documentChangeInfo.multiDeletes,
                        single_adds: fileData.documentChangeInfo.singleAdds,
                        multi_adds: fileData.documentChangeInfo.multiAdds,
                        auto_indents: fileData.documentChangeInfo.autoIndents,
                        replacements: fileData.documentChangeInfo.replacements,
                        start_time: moment.unix(fileData.start).utc().format(),
                        end_time: moment.unix(fileData.end).utc().format(),
                    };
                    const file_entity = {
                        file_name: (_c = (_b = fileData.fsPath) === null || _b === void 0 ? void 0 : _b.split(fileData.projectDir)) === null || _c === void 0 ? void 0 : _c[1],
                        file_path: fileData.fsPath,
                        syntax: fileData.syntax,
                        line_count: fileData.lines,
                        character_count: fileData.length,
                    };
                    const repoParams = yield this.getRepoParams(keystrokeStats.project.directory);
                    const codetime_event = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, codetime_entity), file_entity), projectInfo), this.pluginParams), this.getJwtParams()), repoParams);
                    swdc_tracker_1.default.trackCodeTimeEvent(codetime_event);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fileKeys_1_1 && !fileKeys_1_1.done && (_a = fileKeys_1.return)) yield _a.call(fileKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    trackUIInteraction(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // ui interaction doesn't require a jwt, no need to check for that here
            if (!this.trackerReady) {
                return;
            }
            const ui_interaction = {
                interaction_type: item.interactionType,
            };
            const ui_element = {
                element_name: item.name,
                element_location: item.location,
                color: item.color ? item.color : null,
                icon_name: item.interactionIcon ? item.interactionIcon : null,
                cta_text: !item.hideCTAInTracker
                    ? item.label || item.description || item.tooltip
                    : "redacted",
            };
            const ui_event = Object.assign(Object.assign(Object.assign(Object.assign({}, ui_interaction), ui_element), this.pluginParams), this.getJwtParams());
            swdc_tracker_1.default.trackUIInteraction(ui_event);
        });
    }
    trackEditorAction(entity, type, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.trackerReady) {
                return;
            }
            const projectParams = this.getProjectParams();
            const repoParams = yield this.getRepoParams(projectParams.project_directory);
            const editor_event = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ entity,
                type }, this.pluginParams), this.getJwtParams()), projectParams), this.getFileParams(event, projectParams.project_directory)), repoParams);
            // send the event
            swdc_tracker_1.default.trackEditorAction(editor_event);
        });
    }
    // Static attributes
    getPluginParams() {
        return {
            plugin_id: Util_1.getPluginId(),
            plugin_name: Util_1.getPluginName(),
            plugin_version: Util_1.getVersion(),
        };
    }
    // Dynamic attributes
    getJwtParams() {
        var _a;
        return { jwt: (_a = Util_1.getItem("jwt")) === null || _a === void 0 ? void 0 : _a.split("JWT ")[1] };
    }
    getProjectParams() {
        const workspaceFolders = Util_1.getWorkspaceFolders();
        const project_directory = workspaceFolders.length ? workspaceFolders[0].uri.fsPath : "";
        const project_name = workspaceFolders.length ? workspaceFolders[0].name : "";
        return { project_directory, project_name };
    }
    getRepoParams(projectRootPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceInfo = yield KpmRepoManager_1.getResourceInfo(projectRootPath);
            if (!resourceInfo || !resourceInfo.identifier) {
                // return empty data, no need to parse further
                return {
                    identifier: "",
                    org_name: "",
                    repo_name: "",
                    repo_identifier: "",
                    git_branch: "",
                    git_tag: "",
                };
            }
            // retrieve the git identifier info
            const gitIdentifiers = GitUtil_1.getRepoIdentifierInfo(resourceInfo.identifier);
            return Object.assign(Object.assign({}, gitIdentifiers), { repo_identifier: resourceInfo.identifier, git_branch: resourceInfo.branch, git_tag: resourceInfo.tag });
        });
    }
    getFileParams(event, projectRootPath) {
        var _a, _b, _c, _d, _e;
        if (!event)
            return {};
        // File Open and Close have document attributes on the event.
        // File Change has it on a `document` attribute
        const textDoc = event.document || event;
        if (!textDoc) {
            return {
                file_name: "",
                file_path: "",
                syntax: "",
                line_count: 0,
                character_count: 0,
            };
        }
        let character_count = 0;
        if (typeof textDoc.getText === "function") {
            character_count = textDoc.getText().length;
        }
        return {
            file_name: (_b = (_a = textDoc.fileName) === null || _a === void 0 ? void 0 : _a.split(projectRootPath)) === null || _b === void 0 ? void 0 : _b[1],
            file_path: textDoc.fileName,
            syntax: textDoc.languageId || ((_e = (_d = (_c = textDoc.fileName) === null || _c === void 0 ? void 0 : _c.split(".")) === null || _d === void 0 ? void 0 : _d.slice(-1)) === null || _e === void 0 ? void 0 : _e[0]),
            line_count: textDoc.lineCount || 0,
            character_count,
        };
    }
}
exports.TrackerManager = TrackerManager;
//# sourceMappingURL=TrackerManager.js.map