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
exports.ProjectCommitManager = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("../http/HttpClient");
const Util_1 = require("../Util");
const checkbox_1 = require("../model/checkbox");
const ReportManager_1 = require("./ReportManager");
const moment = require("moment-timezone");
const dateFormat = "YYYY-MM-DD";
class ProjectCommitManager {
    constructor() {
        this.selectedStartTime = 0;
        this.selectedEndTime = 0;
        this.selectedRangeType = "";
        this.local_start = 0;
        this.local_end = 0;
        this.items = [
            {
                label: "Custom",
                value: "custom",
            },
            {
                label: "Today",
                value: "today",
            },
            {
                label: "Yesterday",
                value: "yesterday",
            },
            {
                label: "This week",
                value: "currentWeek",
            },
            {
                label: "Last week",
                value: "lastWeek",
            },
            {
                label: "This month",
                value: "thisMonth",
            },
            {
                label: "Last month",
                value: "lastMonth",
            },
            {
                label: "Last 90 days",
                value: "lastNinetyDays",
            },
        ];
        //
    }
    static getInstance() {
        if (!ProjectCommitManager.instance) {
            ProjectCommitManager.instance = new ProjectCommitManager();
        }
        return ProjectCommitManager.instance;
    }
    resetDateRange() {
        this.selectedStartTime = 0;
        this.selectedEndTime = 0;
        this.selectedRangeType = "";
        this.local_start = 0;
        this.local_end = 0;
    }
    hasDateSelected() {
        return this.selectedRangeType || this.local_start;
    }
    launchDailyReportMenuFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetDateRange();
            const pickItems = this.items.map((item) => {
                return {
                    label: item.label,
                    value: item.value,
                };
            });
            const pick = yield vscode_1.window.showQuickPick(pickItems, {
                placeHolder: "Select a date range",
            });
            if (pick && pick.label) {
                return this.launchProjectSelectionMenu(pick["value"]);
            }
            return null;
        });
    }
    launchViewProjectSummaryMenuFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetDateRange();
            const projectCheckboxes = yield this.getAllProjects();
            return this.launchProjectSelectionMenu(projectCheckboxes);
        });
    }
    // old date to project menu selection flow
    launchProjectSummaryMenuFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetDateRange();
            yield this.getSelectedDateRange();
            if (this.hasDateSelected()) {
                // date was selected, continue with showing the projects
                return this.launchViewProjectSummaryMenuFlow();
            }
        });
    }
    getSelectedDateRange() {
        return __awaiter(this, void 0, void 0, function* () {
            const pickItems = this.items.map((item) => {
                return {
                    label: item.label,
                    value: item.value,
                };
            });
            const pick = yield vscode_1.window.showQuickPick(pickItems, {
                placeHolder: "Select a date range",
            });
            const local = moment().local();
            const offset_in_sec = moment.parseZone(local).utcOffset() * 60;
            if (pick && pick.label) {
                const val = pick["value"];
                if (val === "custom") {
                    // show custom date range input
                    const initialStartVal = moment()
                        .startOf("day")
                        .subtract(1, "day")
                        .format(dateFormat);
                    const startDateText = yield this.showDateInputBox(initialStartVal, dateFormat, "starting");
                    if (startDateText) {
                        // START DATE (begin of day)
                        this.selectedStartTime = moment(startDateText, dateFormat)
                            .startOf("day")
                            .unix();
                        const endVal = moment
                            .unix(this.selectedStartTime)
                            .add(1, "day")
                            .format(dateFormat);
                        const endDateText = yield this.showDateInputBox(endVal, dateFormat, "ending");
                        if (endDateText) {
                            // END DATE (the end of the day)
                            this.selectedEndTime = moment(endDateText, dateFormat)
                                .endOf("day")
                                .unix();
                            // create the local start and end
                            this.local_start = this.selectedStartTime + offset_in_sec;
                            this.local_end = this.selectedEndTime + offset_in_sec;
                        }
                    }
                }
                else {
                    if (val === "lastNinetyDays") {
                        // create the local_start and local_end
                        this.local_start = moment().startOf("day").subtract(90, "days").unix() + offset_in_sec;
                        this.local_end = moment().startOf("day").unix() + offset_in_sec;
                    }
                    else {
                        // fetch the project checkboxes by range type (i.e. "yesterday")
                        this.selectedRangeType = val;
                    }
                }
            }
        });
    }
    getSelectedProjects(checkboxes) {
        return __awaiter(this, void 0, void 0, function* () {
            const pickItems = checkboxes.map((checkbox) => {
                return {
                    value: checkbox.value,
                    picked: checkbox.checked,
                    label: checkbox.label,
                    description: checkbox.text,
                };
            });
            const picks = yield vscode_1.window.showQuickPick(pickItems, {
                placeHolder: "Select one or more projects",
                ignoreFocusOut: false,
                matchOnDescription: true,
                canPickMany: true,
            });
            return picks;
        });
    }
    launchProjectSelectionMenu(projectCheckboxes) {
        return __awaiter(this, void 0, void 0, function* () {
            const picks = yield this.getSelectedProjects(projectCheckboxes);
            // will return an array of ... (value is the projectIds)
            // [{description, label, picked, value}]
            if (picks && picks.length) {
                if (!this.hasDateSelected()) {
                    // launch the date selection menu
                    yield this.getSelectedDateRange();
                    if (!this.hasDateSelected()) {
                        // the menu selection was cancelled
                        return;
                    }
                }
                // go through the array and get the project IDs
                const projectIds = [];
                picks.forEach((item) => {
                    projectIds.push(...item["value"]);
                });
                if (this.selectedRangeType) {
                    ReportManager_1.displayProjectCommitsDashboardByRangeType(this.selectedRangeType, projectIds);
                }
                else if (this.local_start && this.local_end) {
                    ReportManager_1.displayProjectCommitsDashboardByStartEnd(this.local_start, this.local_end, projectIds);
                }
            }
            return null;
        });
    }
    getAllProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProjectCheckboxesByQueryString();
        });
    }
    getProjectCheckboxesByStartEnd(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const qryStr = `?start=${start}&end=${end}`;
            return yield this.getProjectCheckboxesByQueryString(qryStr);
        });
    }
    getProjectCheckboxesByRangeType(type = "lastWeek") {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch the projects from the backend
            const qryStr = `?timeRange=${type}`;
            return yield this.getProjectCheckboxesByQueryString(qryStr);
        });
    }
    getProjectCheckboxesByQueryString(qryStr = "") {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch the projects from the backend
            const api = `/projects${qryStr}`;
            const resp = yield HttpClient_1.softwareGet(api, Util_1.getItem("jwt"));
            let checkboxes = [];
            if (HttpClient_1.isResponseOk(resp)) {
                const projects = resp.data;
                let total_records = 0;
                if (projects && projects.length) {
                    projects.forEach((p) => {
                        if (!p.coding_records) {
                            p["coding_records"] = 1;
                        }
                        total_records += p.coding_records;
                    });
                    let lineNumber = 0;
                    for (let i = 0; i < projects.length; i++) {
                        const p = projects[i];
                        const name = p.project_name
                            ? p.project_name
                            : p.name
                                ? p.name
                                : "";
                        const projectIds = p.projectIds
                            ? p.projectIds
                            : p.id
                                ? [p.id]
                                : [];
                        if (name && projectIds.length) {
                            const percentage = (p.coding_records / total_records) * 100;
                            // coding_records:419, project_name:"swdc-sublime-music-time", projectId:603593
                            const cb = new checkbox_1.default();
                            cb.coding_records = p.coding_records;
                            cb.text = `(${percentage.toFixed(2)}%)`;
                            cb.label = name;
                            cb.checked = true;
                            cb.lineNumber = lineNumber;
                            cb.value = projectIds;
                            checkboxes.push(cb);
                            lineNumber++;
                        }
                    }
                    checkboxes.sort((a, b) => b.coding_records - a.coding_records);
                }
            }
            return checkboxes;
        });
    }
    showDateInputBox(value, placeHolder, datePrompt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showInputBox({
                value,
                placeHolder,
                prompt: `Please enter the ${datePrompt} date of the custom time range (YYYY-MM-DD) to continue..`,
                validateInput: (text) => {
                    const isValid = moment(text, dateFormat, true).isValid();
                    if (!isValid) {
                        return `Please enter a valid date to continue (${dateFormat})`;
                    }
                    const endTime = moment(text, dateFormat).unix();
                    if (this.selectedStartTime &&
                        endTime &&
                        this.selectedStartTime > endTime) {
                        return `Please make sure the end date is after the start date`;
                    }
                    return null;
                },
            });
        });
    }
}
exports.ProjectCommitManager = ProjectCommitManager;
//# sourceMappingURL=ProjectCommitManager.js.map