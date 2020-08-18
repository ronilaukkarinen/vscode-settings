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
const variable_decoration_1 = require("./variable-decoration");
const variables_extractor_1 = require("./variables-extractor");
require("./strategies/css-strategy");
require("./strategies/less-strategy");
require("./strategies/sass-strategy");
require("./strategies/stylus-strategy");
const fs = require("fs");
const vscode_1 = require("vscode");
class VariablesManager {
    constructor() {
        this.statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
    }
    getWorkspaceVariables(includePattern = [], excludePattern = []) {
        return __awaiter(this, void 0, void 0, function* () {
            this.statusBar.text = 'Fetching files...';
            this.statusBar.show();
            try {
                const INCLUDE_PATTERN = `{${includePattern.join(',')}}`;
                const EXCLUDE_PATTERN = `{${excludePattern.join(',')}}`;
                let files = yield vscode_1.workspace.findFiles(INCLUDE_PATTERN, EXCLUDE_PATTERN);
                this.statusBar.text = `Found ${files.length} files`;
                yield Promise.all(this.extractFilesVariable(files));
                let variablesCount = variables_extractor_1.default.getVariablesCount();
                this.statusBar.text = `Found ${variablesCount} variables`;
            }
            catch (error) {
                this.statusBar.text = 'Variables extraction fail';
            }
            return;
        });
    }
    textToDocumentLine(text) {
        return text.split(/\n/)
            .map((text, index) => Object({
            'text': text,
            'line': index
        }));
    }
    getFileContent(file) {
        // here deal with files without contents or unreadable content (like images)
        return file.getText()
            .split(/\n/)
            .map((text, index) => Object({
            'text': text,
            'line': index
        }));
    }
    extractFilesVariable(files) {
        return files.map((file) => __awaiter(this, void 0, void 0, function* () {
            // const document: TextDocument =  await workspace.openTextDocument(file.path);
            // const content: DocumentLine[] = this.getFileContent(document);
            const text = fs.readFileSync(file.fsPath, 'utf8');
            const content = this.textToDocumentLine(text);
            return variables_extractor_1.default.extractDeclarations(file.fsPath, content);
        }));
    }
    findVariablesDeclarations(fileName, fileLines) {
        return variables_extractor_1.default.extractDeclarations(fileName, fileLines);
    }
    findVariables(fileName, fileLines) {
        return variables_extractor_1.default.extractVariables(fileName, fileLines);
    }
    findVariable(variable) {
        return variables_extractor_1.default.findVariable(variable);
    }
    generateDecoration(variable, line) {
        const deco = new variable_decoration_1.default(variable, line);
        return deco;
    }
    setupVariablesExtractors(extractors) {
        variables_extractor_1.default.enableStrategies(extractors);
    }
    deleteVariableInLine(fileName, line) {
        variables_extractor_1.default.deleteVariableInLine(fileName, line);
    }
    removeVariablesDeclarations(fileName) {
        variables_extractor_1.default.removeVariablesDeclarations(fileName);
    }
}
const instance = new VariablesManager();
exports.default = instance;
//# sourceMappingURL=variables-manager.js.map