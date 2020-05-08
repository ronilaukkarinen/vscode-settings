"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var text_parser_1 = require("./utils/text-parser");
var fs_functions_1 = require("./utils/fs-functions");
var PathCompletionItem_1 = require("./completionItems/PathCompletionItem");
var UpCompletionItem_1 = require("./completionItems/UpCompletionItem");
var config_1 = require("./utils/config");
var PathIntellisense = (function () {
    function PathIntellisense(getChildrenOfPath) {
        var _this = this;
        this.getChildrenOfPath = getChildrenOfPath;
        this.setConfig();
        vscode_1.workspace.onDidChangeConfiguration(function () { return _this.setConfig(); });
        config_1.getTsConfig().then(function (tsconfig) {
            _this.tsConfig = tsconfig;
            _this.setConfig();
        });
    }
    PathIntellisense.prototype.provideCompletionItems = function (document, position) {
        var textCurrentLine = document.getText(document.lineAt(position).range);
        var request = {
            config: this.config,
            fileName: document.fileName,
            textCurrentLine: textCurrentLine,
            textWithinString: text_parser_1.getTextWithinString(textCurrentLine, position.character),
            importRange: text_parser_1.importStringRange(textCurrentLine, position),
            isImport: text_parser_1.isImportExportOrRequire(textCurrentLine),
            documentExtension: fs_functions_1.extractExtension(document)
        };
        return this.shouldProvide(request) ? this.provide(request) : Promise.resolve([]);
    };
    PathIntellisense.prototype.shouldProvide = function (request) {
        var typedAnything = request.textWithinString && request.textWithinString.length > 0;
        var startsWithDot = typedAnything && request.textWithinString[0] === '.';
        var startsWithMapping = typedAnything && request.config.mappings.some(function (mapping) { return request.textWithinString.indexOf(mapping.key) === 0; });
        if (request.isImport && (startsWithDot || startsWithMapping)) {
            return true;
        }
        if (!request.isImport && typedAnything) {
            return true;
        }
        return false;
    };
    PathIntellisense.prototype.provide = function (request) {
        var path = fs_functions_1.getPath(request.fileName, request.textWithinString, request.config.absolutePathToWorkspace ? vscode_1.workspace.rootPath : null, request.config.mappings);
        return this.getChildrenOfPath(path, request.config).then(function (children) { return ([
            new UpCompletionItem_1.UpCompletionItem()
        ].concat(children.map(function (child) { return new PathCompletionItem_1.PathCompletionItem(child, request.importRange, request.isImport, request.documentExtension, request.config); }))); });
    };
    PathIntellisense.prototype.setConfig = function () {
        this.config = config_1.getConfig(this.tsConfig);
    };
    return PathIntellisense;
}());
exports.PathIntellisense = PathIntellisense;
//# sourceMappingURL=PathIntellisense.js.map