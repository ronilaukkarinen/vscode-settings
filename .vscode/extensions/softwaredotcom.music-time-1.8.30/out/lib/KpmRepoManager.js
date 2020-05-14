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
const Util_1 = require("./Util");
function getProjectDir(fileName = null) {
    let projectDirs = Util_1.getRootPaths();
    if (!projectDirs || projectDirs.length === 0) {
        return null;
    }
    // VSCode allows having multiple workspaces.
    // for now we only support using the 1st project directory
    // in a given set of workspaces if the provided fileName is null.
    if (projectDirs && projectDirs.length > 0) {
        if (!fileName) {
            return projectDirs[0];
        }
        for (let i = 0; i < projectDirs.length; i++) {
            const dir = projectDirs[i];
            if (fileName.includes(dir)) {
                return dir;
            }
        }
    }
    return null;
}
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
function getFileContributorCount(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileType = Util_1.getFileType(fileName);
        if (fileType === "git") {
            return 0;
        }
        const projectDir = getProjectDir(fileName);
        if (!projectDir) {
            return 0;
        }
        // all we need is the filename of the path
        // const baseName = path.basename(fileName);
        const cmd = `git log --pretty="%an" ${fileName}`;
        // get the list of users that modified this file
        let resultList = yield getCommandResult(cmd, projectDir);
        if (!resultList) {
            // something went wrong, but don't try to parse a null or undefined str
            return 0;
        }
        if (resultList.length > 0) {
            let map = {};
            for (let i = 0; i < resultList.length; i++) {
                const name = resultList[i];
                if (!map[name]) {
                    map[name] = name;
                }
            }
            return Object.keys(map).length;
        }
        return 0;
    });
}
exports.getFileContributorCount = getFileContributorCount;
function getRepoFileCount(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectDir = getProjectDir(fileName);
        if (!projectDir) {
            return 0;
        }
        // windows doesn't support the wc -l so we'll just count the list
        let cmd = `git ls-files`;
        // get the author name and email
        let resultList = yield getCommandResult(cmd, projectDir);
        if (!resultList) {
            // something went wrong, but don't try to parse a null or undefined str
            return 0;
        }
        return resultList.length;
    });
}
exports.getRepoFileCount = getRepoFileCount;
function getRepoContributorInfo(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectDir = getProjectDir(fileName);
        if (!projectDir) {
            return null;
        }
        let repoContributorInfo = {
            identifier: "",
            tag: "",
            branch: "",
            count: 0,
            members: []
        };
        // get the repo url, branch, and tag
        const resourceInfo = yield getResourceInfo(projectDir);
        if (resourceInfo && resourceInfo.identifier) {
            repoContributorInfo.identifier = resourceInfo.identifier;
            repoContributorInfo.tag = resourceInfo.tag;
            repoContributorInfo.branch = resourceInfo.branch;
            // windows doesn't support the "uniq" command, so
            // we'll just go through all of them if it's windows....
            // username, email
            let cmd = `git log --pretty="%an,%ae" | sort`;
            if (!Util_1.isWindows()) {
                cmd += " | uniq";
            }
            // get the author name and email
            let resultList = yield getCommandResult(cmd, projectDir);
            if (!resultList) {
                // something went wrong, but don't try to parse a null or undefined str
                return repoContributorInfo;
            }
            let map = {};
            if (resultList && resultList.length > 0) {
                // count name email
                resultList.forEach(listInfo => {
                    const devInfo = listInfo.split(",");
                    const name = devInfo[0];
                    const email = Util_1.normalizeGithubEmail(devInfo[1]);
                    if (!map[email]) {
                        repoContributorInfo.members.push({
                            name,
                            email
                        });
                        map[email] = email;
                    }
                });
            }
            repoContributorInfo.count = repoContributorInfo.members.length;
        }
        return repoContributorInfo;
    });
}
exports.getRepoContributorInfo = getRepoContributorInfo;
//
// use "git symbolic-ref --short HEAD" to get the git branch
// use "git config --get remote.origin.url" to get the remote url
function getResourceInfo(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let branch = yield Util_1.wrapExecPromise("git symbolic-ref --short HEAD", projectDir);
        let identifier = yield Util_1.wrapExecPromise("git config --get remote.origin.url", projectDir);
        let email = yield Util_1.wrapExecPromise("git config user.email", projectDir);
        email = Util_1.normalizeGithubEmail(email);
        let tag = yield Util_1.wrapExecPromise("git describe --all", projectDir);
        // both should be valid to return the resource info
        if (branch && identifier) {
            return { branch, identifier, email, tag };
        }
        // we don't have git info, return an empty object
        return {};
    });
}
exports.getResourceInfo = getResourceInfo;
//# sourceMappingURL=KpmRepoManager.js.map