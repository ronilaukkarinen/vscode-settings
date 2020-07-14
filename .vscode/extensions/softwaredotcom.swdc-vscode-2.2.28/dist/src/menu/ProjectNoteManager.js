"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectNoteManager = void 0;
const vscode_1 = require("vscode");
class ProjectNoteManager {
    constructor() {
        //
    }
    static getInstance() {
        if (!ProjectNoteManager.instance) {
            ProjectNoteManager.instance = new ProjectNoteManager();
        }
        return ProjectNoteManager.instance;
    }
    addNote() {
        vscode_1.window.showInputBox({
            value: "",
            placeHolder: "Enter a note",
            validateInput: text => {
                return !text
                    ? "Please enter a non-empty note to continue."
                    : null;
            }
        });
    }
}
exports.ProjectNoteManager = ProjectNoteManager;
//# sourceMappingURL=ProjectNoteManager.js.map