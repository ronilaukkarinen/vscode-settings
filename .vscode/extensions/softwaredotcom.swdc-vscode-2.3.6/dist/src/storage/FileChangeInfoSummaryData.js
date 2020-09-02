"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFileChangeInfoToDisk = exports.getFileChangeSummaryAsJson = exports.clearFileChangeInfoSummaryData = exports.getFileChangeSummaryFile = void 0;
const Util_1 = require("../Util");
const fileIt = require("file-it");
function getFileChangeSummaryFile() {
    let file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\fileChangeSummary.json";
    }
    else {
        file += "/fileChangeSummary.json";
    }
    return file;
}
exports.getFileChangeSummaryFile = getFileChangeSummaryFile;
function clearFileChangeInfoSummaryData() {
    saveFileChangeInfoToDisk({});
}
exports.clearFileChangeInfoSummaryData = clearFileChangeInfoSummaryData;
// returns a map of file change info
// {fileName => FileChangeInfo, fileName => FileChangeInfo}
function getFileChangeSummaryAsJson() {
    let fileChangeInfoMap = Util_1.getFileDataAsJson(getFileChangeSummaryFile());
    if (!fileChangeInfoMap) {
        fileChangeInfoMap = {};
    }
    return fileChangeInfoMap;
}
exports.getFileChangeSummaryAsJson = getFileChangeSummaryAsJson;
function saveFileChangeInfoToDisk(fileChangeInfoData) {
    const file = getFileChangeSummaryFile();
    if (fileChangeInfoData) {
        fileIt.writeJsonFileSync(file, fileChangeInfoData, { spaces: 4 });
    }
}
exports.saveFileChangeInfoToDisk = saveFileChangeInfoToDisk;
//# sourceMappingURL=FileChangeInfoSummaryData.js.map