"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_uri_1 = require("vscode-uri");
const fs_1 = require("./utils/fs");
const fileSystemProvider = {
    async stat(uri) {
        const filePath = vscode_uri_1.URI.parse(uri).fsPath;
        try {
            const stats = await fs_1.statFile(filePath);
            let type = vscode_css_languageservice_1.FileType.Unknown;
            if (stats.isFile()) {
                type = vscode_css_languageservice_1.FileType.File;
            }
            else if (stats.isDirectory()) {
                type = vscode_css_languageservice_1.FileType.Directory;
            }
            else if (stats.isSymbolicLink()) {
                type = vscode_css_languageservice_1.FileType.SymbolicLink;
            }
            return {
                type,
                ctime: stats.ctime.getTime(),
                mtime: stats.mtime.getTime(),
                size: stats.size
            };
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            return {
                type: vscode_css_languageservice_1.FileType.Unknown,
                ctime: -1,
                mtime: -1,
                size: -1
            };
        }
    }
};
function getLanguageService(completionParticipants) {
    const ls = vscode_css_languageservice_1.getSCSSLanguageService({ fileSystemProvider });
    if (completionParticipants !== undefined) {
        ls.setCompletionParticipants(completionParticipants);
    }
    ls.configure({
        validate: false
    });
    return ls;
}
exports.getLanguageService = getLanguageService;
//# sourceMappingURL=language-service.js.map