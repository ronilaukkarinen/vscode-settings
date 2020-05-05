"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
class DepNodeProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No variables in empty workspace');
            return Promise.resolve([]);
        }
        const colorsFile = this.workspaceRoot;
        if (this.pathExists(colorsFile)) {
            return Promise.resolve(this.getColorsVariables(colorsFile));
        }
        else {
            vscode.window.showInformationMessage('Workspace has color variables');
            return Promise.resolve([]);
        }
    }
    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    getColorsVariables(colorsFile) {
        if (this.pathExists(colorsFile)) {
            const variables = fs.readFileSync(colorsFile, 'utf-8');
            const match = variables.match(/(\$.*\;)/g);
            const colorsArr = [];
            for (let i = 0; i < match.length; i++) {
                const m = match[i];
                const split = m.split(':');
                const color = {
                    'colorName': split[0].replace('$', ''),
                    'color': split[1].trim().replace(';', '')
                };
                colorsArr.push(color);
            }
            const toColor = (colorName, color) => {
                return new Color(colorName, color, vscode.TreeItemCollapsibleState.None, {
                    command: 'extension.openPackageOnNpm',
                    title: '',
                    arguments: [colorName]
                });
            };
            const colors = colorsArr
                ? colorsArr.map(c => toColor(c['colorName'], c['color']))
                : [];
            return colors;
        }
        else {
            return [];
        }
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
exports.DepNodeProvider = DepNodeProvider;
class Color extends vscode.TreeItem {
    constructor(label, color, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.color = color;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'color', `${this.color}.svg`),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'color', `${this.color}.svg`)
        };
        this.contextValue = 'color';
        this.createIcon(this.color);
    }
    get tooltip() {
        return `${this.label} : ${this.color}`;
    }
    createIcon(color) {
        const iconPath = path.join(__filename, '..', '..', '..', 'resources', 'color', `${color}.svg`);
        if (this.pathExists(iconPath)) {
            return false;
        }
        const iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="8" fill="${color}"/></svg>`;
        try {
            fs.writeFileSync(iconPath, iconContent);
        }
        catch (e) {
            console.log(e);
        }
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=nodeDependencies.js.map