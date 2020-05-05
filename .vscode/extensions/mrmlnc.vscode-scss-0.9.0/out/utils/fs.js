'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fg = require("fast-glob");
function findFiles(pattern, options) {
    return fg(pattern, Object.assign(Object.assign({}, options), { absolute: true, dot: true, suppressErrors: true }));
}
exports.findFiles = findFiles;
function fileExists(filepath) {
    return new Promise(resolve => {
        fs.access(filepath, fs.constants.F_OK, error => {
            return resolve(error === null);
        });
    });
}
exports.fileExists = fileExists;
function fileExistsSync(filepath) {
    return fs.existsSync(filepath);
}
exports.fileExistsSync = fileExistsSync;
/**
 * Read file by specified filepath;
 */
function readFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString());
        });
    });
}
exports.readFile = readFile;
/**
 * Read file by specified filepath;
 */
function statFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) {
                return reject(err);
            }
            resolve(stat);
        });
    });
}
exports.statFile = statFile;
//# sourceMappingURL=fs.js.map