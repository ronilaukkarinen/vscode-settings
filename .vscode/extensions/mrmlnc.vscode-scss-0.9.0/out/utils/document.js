'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const url = require("url");
const vscode_uri_1 = require("vscode-uri");
const fs_1 = require("../utils/fs");
/**
 * Returns the path to the document, relative to the current document.
 */
function getDocumentPath(currentPath, symbolsPath) {
    const rootUri = path.dirname(currentPath);
    const docPath = path.relative(rootUri, symbolsPath);
    if (docPath === path.basename(currentPath)) {
        return 'current';
    }
    return docPath.replace(/\\/g, '/');
}
exports.getDocumentPath = getDocumentPath;
/**
 * Primary copied from the original VSCode CSS extension:
 * https://github.com/microsoft/vscode/blob/2bb6cfc16a88281b75cfdaced340308ff89a849e/extensions/css-language-features/server/src/utils/documentContext.ts
 */
function buildDocumentContext(base) {
    return {
        resolveReference: ref => {
            // Following [css-loader](https://github.com/webpack-contrib/css-loader#url)
            // And [sass-loader's](https://github.com/webpack-contrib/sass-loader#imports)
            // Convention, if an import path starts with ~ then use node module resolution
            // *unless* it starts with "~/" as this refers to the user's home directory.
            if (ref[0] === '~' && ref[1] !== '/') {
                ref = ref.substring(1);
                if (base.startsWith('file:')) {
                    const moduleName = getModuleNameFromPath(ref);
                    const modulePath = resolvePathToModule(moduleName, base);
                    if (modulePath) {
                        return url.resolve(modulePath, ref);
                    }
                }
            }
            return url.resolve(base, ref);
        }
    };
}
exports.buildDocumentContext = buildDocumentContext;
function getModuleNameFromPath(filepath) {
    /**
     * If a scoped module (starts with @) then get up until second instance of '/',
     * otherwise get until first instance of '/'.
     */
    if (filepath[0] === '@') {
        return filepath.substring(0, filepath.indexOf('/', filepath.indexOf('/') + 1));
    }
    return filepath.substring(0, filepath.indexOf('/'));
}
exports.getModuleNameFromPath = getModuleNameFromPath;
function resolvePathToModule(moduleName, relativeTo) {
    const documentFolder = path.dirname(vscode_uri_1.URI.parse(relativeTo).fsPath);
    const packageDirectory = path.join(documentFolder, 'node_modules', moduleName);
    if (fs_1.fileExistsSync(packageDirectory)) {
        return vscode_uri_1.URI.file(packageDirectory).toString();
    }
    return undefined;
}
exports.resolvePathToModule = resolvePathToModule;
//# sourceMappingURL=document.js.map