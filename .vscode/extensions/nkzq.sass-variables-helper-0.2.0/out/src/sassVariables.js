"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
class colorProvider {
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
        const colorsVars = this.getColorsVariables(this.workspaceRoot);
        if (colorsVars == []) {
            vscode.window.showInformationMessage('Workspace has no color variables');
        }
        return Promise.resolve(colorsVars);
    }
    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    getColorsVariables(colorsFile) {
        if (fs.existsSync(colorsFile)) {
            const variables = fs.readFileSync(colorsFile, 'utf-8');
            const onlyVarColors = variables.match(/(?![\/\/\s*COLORS])[\s\S\r\n]+(.*)(?=\/\/\s*END\s*COLORS)/gm);
            const match = onlyVarColors[0].match(/(\$.*\;)/g);
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
            const colors = this.cleanDuplicateColors(colorsArr)
                ? colorsArr.map(c => toColor(c['colorName'], c['color']))
                : [];
            return colors;
        }
        else {
            return [];
        }
    }
    cleanDuplicateColors(colors) {
        const dup = colors.filter(c => c.color.match(/(\$.*)/g));
        dup.map(d => {
            const label = d.color.replace('$', '');
            const findColor = colors.filter(c => c.colorName === label)[0];
            d.color = findColor.color;
        });
        return [...colors, ...dup];
    }
}
exports.colorProvider = colorProvider;
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
    cleanFolderIcons(dirPath) {
        try {
            var files = fs.readdirSync(dirPath);
        }
        catch (e) {
            return;
        }
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
                else
                    this.cleanFolderIcons(filePath);
            }
        }
    }
    createIcon(color) {
        return __awaiter(this, void 0, void 0, function* () {
            const iconPath = path.join(__filename, '..', '..', '..', 'resources', 'color', `${color}.svg`);
            yield this.cleanFolderIcons(path.join(__filename, '..', '..', '..', 'resources', 'color'));
            if (fs.existsSync(iconPath)) {
                return false;
            }
            const iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="8" fill="${color}"/></svg>`;
            try {
                fs.writeFileSync(iconPath, iconContent);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
//# sourceMappingURL=sassVariables.js.map