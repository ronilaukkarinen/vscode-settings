"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../model/models");
const Util_1 = require("../Util");
const KpmRepoManager_1 = require("./KpmRepoManager");
const CacheManager_1 = require("../cache/CacheManager");
const moment = require("moment-timezone");
const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY_SEC = ONE_HOUR_IN_SEC * 24;
const ONE_WEEK_SEC = ONE_DAY_SEC * 7;
const cacheMgr = CacheManager_1.CacheManager.getInstance();
const cacheTimeoutSeconds = 60 * 10;
function getCommandResult(cmd, projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield Util_1.wrapExecPromise(cmd, projectDir);
        if (!result) {
            // something went wrong, but don't try to parse a null or undefined str
            return null;
        }
        result = result.trim();
        let resultList = result
            .replace(/\r\n/g, "\r")
            .replace(/\n/g, "\r")
            .replace(/^\s+/g, " ")
            .replace(/</g, "")
            .replace(/>/g, "")
            .split(/\r/);
        return resultList;
    });
}
exports.getCommandResult = getCommandResult;
function getCommandResultString(cmd, projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield Util_1.wrapExecPromise(cmd, projectDir);
        if (!result) {
            // something went wrong, but don't try to parse a null or undefined str
            return null;
        }
        result = result.trim();
        result = result
            .replace(/\r\n/g, "\r")
            .replace(/\n/g, "\r")
            .replace(/^\s+/g, " ");
        return result;
    });
}
exports.getCommandResultString = getCommandResultString;
/**
 * Looks through all of the lines for
 * files changed, insertions, and deletions and aggregates
 * @param results
 */
function accumulateStatChanges(results) {
    const stats = new models_1.CommitChangeStats();
    if (results) {
        for (let i = 0; i < results.length; i++) {
            const line = results[i].trim();
            // look for the line with "insertion" and "deletion"
            if (line.includes("changed") &&
                (line.includes("insertion") || line.includes("deletion"))) {
                // split by space, then the number before the keyword is our value
                const parts = line.split(" ");
                // the very first element is the number of files changed
                const fileCount = parseInt(parts[0], 10);
                stats.fileCount += fileCount;
                stats.commitCount += 1;
                for (let x = 1; x < parts.length; x++) {
                    const part = parts[x];
                    if (part.includes("insertion")) {
                        const insertions = parseInt(parts[x - 1], 10);
                        if (insertions) {
                            stats.insertions += insertions;
                        }
                    }
                    else if (part.includes("deletion")) {
                        const deletions = parseInt(parts[x - 1], 10);
                        if (deletions) {
                            stats.deletions += deletions;
                        }
                    }
                }
            }
        }
    }
    return stats;
}
exports.accumulateStatChanges = accumulateStatChanges;
function getChangeStats(projectDir, cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        let changeStats = new models_1.CommitChangeStats();
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            return changeStats;
        }
        /**
         * example:
         * -mbp-2:swdc-vscode xavierluiz$ git diff --stat
            lib/KpmProviderManager.ts | 22 ++++++++++++++++++++--
            1 file changed, 20 insertions(+), 2 deletions(-)
    
            for multiple files it will look like this...
            7 files changed, 137 insertions(+), 55 deletions(-)
         */
        const resultList = yield getCommandResult(cmd, projectDir);
        if (!resultList) {
            // something went wrong, but don't try to parse a null or undefined str
            return changeStats;
        }
        // just look for the line with "insertions" and "deletions"
        changeStats = accumulateStatChanges(resultList);
        return changeStats;
    });
}
function getUncommitedChanges(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            new models_1.CommitChangeStats();
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `uncommitted-changes-${noSpacesProjDir}`;
        let commitChanges = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (commitChanges) {
            return commitChanges;
        }
        const cmd = `git diff --stat`;
        commitChanges = yield getChangeStats(projectDir, cmd);
        if (commitChanges) {
            cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
        }
        return commitChanges;
    });
}
exports.getUncommitedChanges = getUncommitedChanges;
function getTodaysCommits(projectDir, useAuthor = true) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            new models_1.CommitChangeStats();
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `todays-commits-${noSpacesProjDir}`;
        let commitChanges = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (commitChanges) {
            return commitChanges;
        }
        const { start, end } = getToday();
        commitChanges = yield getCommitsInUtcRange(projectDir, start, end, useAuthor);
        if (commitChanges) {
            cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
        }
        return commitChanges;
    });
}
exports.getTodaysCommits = getTodaysCommits;
function getYesterdaysCommits(projectDir, useAuthor = true) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            new models_1.CommitChangeStats();
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `yesterdays-commits-${noSpacesProjDir}`;
        let commitChanges = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (commitChanges) {
            return commitChanges;
        }
        const { start, end } = getYesterday();
        commitChanges = yield getCommitsInUtcRange(projectDir, start, end, useAuthor);
        if (commitChanges) {
            cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
        }
        return commitChanges;
    });
}
exports.getYesterdaysCommits = getYesterdaysCommits;
function getThisWeeksCommits(projectDir, useAuthor = true) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            new models_1.CommitChangeStats();
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `this-weeks-commits-${noSpacesProjDir}`;
        let commitChanges = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (commitChanges) {
            return commitChanges;
        }
        const { start, end } = getThisWeek();
        commitChanges = yield getCommitsInUtcRange(projectDir, start, end, useAuthor);
        if (commitChanges) {
            cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
        }
        return commitChanges;
    });
}
exports.getThisWeeksCommits = getThisWeeksCommits;
function getCommitsInUtcRange(projectDir, start, end, useAuthor = true) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            new models_1.CommitChangeStats();
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `commits-in-range-${noSpacesProjDir}`;
        let commitChanges = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (commitChanges) {
            return commitChanges;
        }
        const resourceInfo = yield KpmRepoManager_1.getResourceInfo(projectDir);
        const authorOption = useAuthor && resourceInfo && resourceInfo.email
            ? ` --author=${resourceInfo.email}`
            : ``;
        const cmd = `git log --stat --pretty="COMMIT:%H,%ct,%cI,%s" --since=${start} --until=${end}${authorOption}`;
        commitChanges = yield getChangeStats(projectDir, cmd);
        if (commitChanges) {
            cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
        }
        return commitChanges;
    });
}
function getSlackReportCommits(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            return [];
        }
        const startEnd = getThisWeek();
        const resourceInfo = yield KpmRepoManager_1.getResourceInfo(projectDir);
        if (!resourceInfo || !resourceInfo.email) {
            return [];
        }
        const authorOption = ` --author=${resourceInfo.email}`;
        const cmd = `git log --pretty="%s" --since=${startEnd.start} --until=${startEnd.end}${authorOption}`;
        const resultList = yield getCommandResult(cmd, projectDir);
        return resultList;
    });
}
exports.getSlackReportCommits = getSlackReportCommits;
function getLastCommitId(projectDir, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            return {};
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `last-commit-id-${noSpacesProjDir}`;
        let lastCommitIdInfo = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (lastCommitIdInfo) {
            return lastCommitIdInfo;
        }
        lastCommitIdInfo = {};
        const authorOption = email ? ` --author=${email}` : "";
        const cmd = `git log --pretty="%H,%s"${authorOption} --max-count=1`;
        const list = yield getCommandResult(cmd, projectDir);
        if (list && list.length) {
            const parts = list[0].split(",");
            if (parts && parts.length === 2) {
                lastCommitIdInfo = {
                    commitId: parts[0],
                    comment: parts[1],
                };
                // cache it
                cacheMgr.set(cacheId, lastCommitIdInfo, cacheTimeoutSeconds);
            }
        }
        return lastCommitIdInfo;
    });
}
exports.getLastCommitId = getLastCommitId;
function getRepoConfigUserEmail(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            return "";
        }
        const cmd = `git config user.email`;
        return yield getCommandResultString(cmd, projectDir);
    });
}
exports.getRepoConfigUserEmail = getRepoConfigUserEmail;
function getRepoUrlLink(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectDir || !Util_1.isGitProject(projectDir)) {
            return "";
        }
        const noSpacesProjDir = projectDir.replace(/^\s+/g, "");
        const cacheId = `repo-link-url-${noSpacesProjDir}`;
        let repoUrlLink = cacheMgr.get(cacheId);
        // return from cache if we have it
        if (repoUrlLink) {
            return repoUrlLink;
        }
        const cmd = `git config --get remote.origin.url`;
        repoUrlLink = yield getCommandResultString(cmd, projectDir);
        if (repoUrlLink && repoUrlLink.endsWith(".git")) {
            repoUrlLink = repoUrlLink.substring(0, repoUrlLink.lastIndexOf(".git"));
        }
        if (repoUrlLink) {
            // cache it
            cacheMgr.set(cacheId, repoUrlLink, cacheTimeoutSeconds);
        }
        return repoUrlLink;
    });
}
exports.getRepoUrlLink = getRepoUrlLink;
/**
 * Returns the user's today's start and end in UTC time
 * @param {Object} user
 */
function getToday() {
    const start = moment().startOf("day").unix();
    const end = start + ONE_DAY_SEC;
    return { start, end };
}
exports.getToday = getToday;
/**
 * Returns the user's yesterday start and end in UTC time
 */
function getYesterday() {
    const start = moment().subtract(1, "day").startOf("day").unix();
    const end = start + ONE_DAY_SEC;
    return { start, end };
}
exports.getYesterday = getYesterday;
/**
 * Returns the user's this week's start and end in UTC time
 */
function getThisWeek() {
    const start = moment().startOf("week").unix();
    const end = start + ONE_WEEK_SEC;
    return { start, end };
}
exports.getThisWeek = getThisWeek;
//# sourceMappingURL=GitUtil.js.map