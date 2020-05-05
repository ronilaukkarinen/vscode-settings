"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var fs_1 = require("fs");
function getConfig(tsconfig) {
    var configuration = vscode_1.workspace.getConfiguration('path-intellisense');
    return {
        autoSlash: configuration['autoSlashAfterDirectory'],
        mappings: getMappings(configuration).concat(createMappingsFromTsConfig(tsconfig)),
        showHiddenFiles: configuration['showHiddenFiles'],
        withExtension: configuration['extensionOnImport'],
        absolutePathToWorkspace: configuration['absolutePathToWorkspace'],
        filesExclude: vscode_1.workspace.getConfiguration('files')['exclude']
    };
}
exports.getConfig = getConfig;
function getTsConfig() {
    return vscode_1.workspace.findFiles('tsconfig.json', '**/node_modules/**').then(function (files) {
        if (files && files[0]) {
            return JSON.parse(fs_1.readFileSync(files[0].fsPath).toString());
        }
        else {
            return {};
        }
    });
}
exports.getTsConfig = getTsConfig;
function createMappingsFromTsConfig(tsconfig) {
    var mappings = [];
    if (tsconfig && tsconfig.compilerOptions) {
        var _a = tsconfig.compilerOptions, baseUrl = _a.baseUrl, paths = _a.paths;
        if (baseUrl) {
            mappings.push({ key: baseUrl, value: vscode_1.workspace.rootPath + "/" + baseUrl });
        }
        // Todo: paths property
    }
    return mappings;
}
function getMappings(configuration) {
    var mappings = configuration['mappings'];
    return Object.keys(mappings)
        .map(function (key) { return ({ key: key, value: mappings[key] }); })
        .filter(function (mapping) { return !!vscode_1.workspace.rootPath || mapping.value.indexOf('${workspaceRoot}') === -1; })
        .map(function (mapping) { return ({ key: mapping.key, value: mapping.value.replace('${workspaceRoot}', vscode_1.workspace.rootPath) }); });
}
//# sourceMappingURL=config.js.map