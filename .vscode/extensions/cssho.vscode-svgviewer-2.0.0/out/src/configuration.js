"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
class Configuration {
    static viewColumn() {
        switch (vscode.workspace.getConfiguration('svgviewer').get('previewcolumn')) {
            case "Active": return vscode_1.ViewColumn.Active;
            case "Beside": return vscode_1.ViewColumn.Beside;
            default: return vscode_1.ViewColumn.Beside;
        }
    }
    static showTransGrid() {
        return vscode.workspace.getConfiguration('svgviewer').get('transparencygrid');
    }
    static transparencyColor() {
        return vscode.workspace.getConfiguration('svgviewer').get('transparencycolor');
    }
    static enableAutoPreview() {
        return vscode.workspace.getConfiguration('svgviewer').get('enableautopreview');
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map