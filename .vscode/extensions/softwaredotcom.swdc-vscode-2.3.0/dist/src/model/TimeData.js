"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("./Project");
class TimeData {
    constructor() {
        this.editor_seconds = 0;
        this.session_seconds = 0;
        this.file_seconds = 0;
        this.day = "";
        this.project = new Project_1.default();
    }
}
exports.default = TimeData;
//# sourceMappingURL=TimeData.js.map