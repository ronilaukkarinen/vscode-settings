"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
const CacheManager_1 = require("../cache/CacheManager");
const fs = require("fs");
const cacheMgr = CacheManager_1.CacheManager.getInstance();
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
    let fileChangeInfoMap = cacheMgr.get("fileChangeSummary");
    if (!fileChangeInfoMap) {
        const file = getFileChangeSummaryFile();
        fileChangeInfoMap = Util_1.getFileDataAsJson(file);
        if (!fileChangeInfoMap) {
            fileChangeInfoMap = {};
        }
        else {
            cacheMgr.set("fileChangeSummary", fileChangeInfoMap);
        }
    }
    return fileChangeInfoMap;
}
exports.getFileChangeSummaryAsJson = getFileChangeSummaryAsJson;
function saveFileChangeInfoToDisk(fileChangeInfoData) {
    const file = getFileChangeSummaryFile();
    if (fileChangeInfoData) {
        try {
            const content = JSON.stringify(fileChangeInfoData, null, 4);
            fs.writeFileSync(file, content, err => {
                if (err)
                    Util_1.logIt(`Deployer: Error writing session summary data: ${err.message}`);
            });
            // update the cache
            if (fileChangeInfoData) {
                cacheMgr.set("fileChangeSummary", fileChangeInfoData);
            }
        }
        catch (e) {
            //
        }
    }
}
exports.saveFileChangeInfoToDisk = saveFileChangeInfoToDisk;
//# sourceMappingURL=FileChangeInfoSummaryData.js.map