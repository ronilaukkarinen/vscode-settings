"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var file_info_1 = require("./file-info");
var minimatch = require("minimatch");
function getChildrenOfPath(path, config) {
    return readdirPromise(path)
        .then(function (files) { return files
        .filter(function (filename) { return filterFile(filename, config); })
        .map(function (f) { return new file_info_1.FileInfo(path, f); }); })
        .catch(function () { return []; });
}
exports.getChildrenOfPath = getChildrenOfPath;
/**
 * @param fileName  {string} current filename the look up is done. Absolute path
 * @param text      {string} text in import string. e.g. './src/'
 */
function getPath(fileName, text, rootPath, mappings) {
    var normalizedText = path.normalize(text);
    var textAfterLastSlashRemoved = normalizedText.substring(0, normalizedText.lastIndexOf(path.sep) + 1);
    var isPathAbsolute = normalizedText.startsWith(path.sep);
    var rootFolder = path.dirname(fileName);
    var pathEntered = normalizedText;
    // Search a mapping for the current text. First mapping is used where text starts with mapping
    var mapping = mappings && mappings.reduce(function (prev, curr) {
        return prev || (normalizedText.startsWith(curr.key) && curr);
    }, undefined);
    if (mapping) {
        rootFolder = mapping.value;
        pathEntered = normalizedText.substring(mapping.key.length, normalizedText.length);
    }
    if (isPathAbsolute) {
        rootFolder = rootPath || '';
    }
    return path.join(rootFolder, pathEntered);
}
exports.getPath = getPath;
function extractExtension(document) {
    if (document.isUntitled) {
        return undefined;
    }
    var fragments = document.fileName.split('.');
    var extension = fragments[fragments.length - 1];
    if (!extension || extension.length > 3) {
        return undefined;
    }
    return extension;
}
exports.extractExtension = extractExtension;
function readdirPromise(path) {
    return new Promise(function (resolve, reject) {
        fs_1.readdir(path, function (error, files) {
            if (error) {
                reject(error);
            }
            else {
                resolve(files);
            }
        });
    });
}
function filterFile(filename, config) {
    if (config.showHiddenFiles) {
        return true;
    }
    return isFileHidden(filename, config) ? false : true;
}
function isFileHidden(filename, config) {
    return filename.startsWith('.') || isFileHiddenByVsCode(filename, config);
}
/**
 * files.exclude has the following form. key is the glob
 * {
 *    "**/ /*.js": true
*    "**/ /*.js": true "*.git": true
* }
*/
function isFileHiddenByVsCode(filename, config) {
    return config.filesExclude && Object.keys(config.filesExclude)
        .some(function (key) { return config.filesExclude[key] && minimatch(filename, key); });
}
//# sourceMappingURL=fs-functions.js.map