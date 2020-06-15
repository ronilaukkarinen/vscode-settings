"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * From { "lib": "libraries", "other": "otherpath" }
 * To [ { key: "lib", value: "libraries" }, { key: "other", value: "otherpath" } ]
 * @param mappings { "lib": "libraries" }
 */
function parseMappings(mappings) {
    return Object.entries(mappings).map(([key, value]) => ({ key, value }));
}
exports.parseMappings = parseMappings;
/**
 * Replace ${workspaceRoot} with workfolder.uri.path
 * @param mappings
 * @param workfolder
 */
function replaceWorkspaceRoot(mappings, workfolder) {
    const rootPath = workfolder === null || workfolder === void 0 ? void 0 : workfolder.uri.path;
    if (rootPath) {
        return mappings.map(({ key, value }) => ({
            key,
            value: value.replace("${workspaceRoot}", rootPath),
        }));
    }
    else {
        return mappings.filter(({ value }) => value.indexOf("${workspaceRoot}") === -1);
    }
}
exports.replaceWorkspaceRoot = replaceWorkspaceRoot;
//# sourceMappingURL=mapping.service.js.map