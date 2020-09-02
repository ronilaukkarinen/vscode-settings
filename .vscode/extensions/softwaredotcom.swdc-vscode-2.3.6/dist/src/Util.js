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
exports.getFileDataPayloadsAsJson = exports.getFileDataArray = exports.getFileDataAsJson = exports.cleanJsonString = exports.getFileType = exports.createSpotifyIdFromUri = exports.buildQueryString = exports.getColumnHeaders = exports.getRowLabels = exports.getRightAlignedTableHeader = exports.getTableHeader = exports.getSectionHeader = exports.getDashboardBottomBorder = exports.getDashboardRow = exports.showWarningMessage = exports.showInformationMessage = exports.connectAtlassian = exports.buildLoginUrl = exports.showLoginPrompt = exports.launchLogin = exports.humanizeMinutes = exports.formatNumber = exports.launchWebUrl = exports.wrapExecPromise = exports.normalizeGithubEmail = exports.deleteFile = exports.randomCode = exports.getNowTimes = exports.coalesceNumber = exports.isNewDay = exports.getFormattedDay = exports.getOffsetSeconds = exports.nowInSecs = exports.showOfflinePrompt = exports.logIt = exports.logEvent = exports.getExtensionName = exports.openFileInEditor = exports.displayReadmeIfNotExists = exports.getLocalREADMEFile = exports.jwtExists = exports.softwareSessionFileExists = exports.getSoftwareDir = exports.getDailyReportSummaryFile = exports.getProjectContributorCodeSummaryFile = exports.getProjectCodeSummaryFile = exports.getSummaryInfoFile = exports.getCommitSummaryFile = exports.getDashboardFile = exports.getTimeCounterFile = exports.getPluginEventsFile = exports.getSoftwareDataStoreFile = exports.getSoftwareSessionFile = exports.getOsUsername = exports.getCommandResultList = exports.getCommandResultLine = exports.getOs = exports.getHostname = exports.isMac = exports.isWindows = exports.isLinux = exports.isEmptyObj = exports.isStatusBarTextVisible = exports.toggleStatusBar = exports.showStatus = exports.showLoading = exports.getItem = exports.setItem = exports.validateEmail = exports.getProjectFolder = exports.getWorkspaceFolderByPath = exports.getRootPathForFile = exports.isFileOpen = exports.getNumberOfTextDocumentsOpen = exports.getFirstWorkspaceFolder = exports.getWorkspaceFolders = exports.findFirstActiveDirectoryOrWorkspaceDirectory = exports.isFileActive = exports.getActiveProjectWorkspace = exports.getFileAgeInDays = exports.isBatchSizeUnderThreshold = exports.isGitProject = exports.getSessionFileCreateTime = exports.codeTimeExtInstalled = exports.isCodeTimeMetricsFile = exports.getVersion = exports.getPluginType = exports.getPluginName = exports.getPluginId = exports.getWorkspaceName = exports.MARKER_WIDTH = exports.TABLE_WIDTH = exports.DASHBOARD_LRG_COL_WIDTH = exports.DASHBOARD_COL_WIDTH = exports.DASHBOARD_VALUE_WIDTH = exports.DASHBOARD_LABEL_WIDTH = exports.alpha = void 0;
const extension_1 = require("./extension");
const vscode_1 = require("vscode");
const Constants_1 = require("./Constants");
const DataController_1 = require("./DataController");
const SessionSummaryData_1 = require("./storage/SessionSummaryData");
const OnboardManager_1 = require("./user/OnboardManager");
const AccountManager_1 = require("./menu/AccountManager");
const fileIt = require("file-it");
const moment = require("moment-timezone");
const open = require("open");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");
exports.alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
exports.DASHBOARD_LABEL_WIDTH = 28;
exports.DASHBOARD_VALUE_WIDTH = 36;
exports.DASHBOARD_COL_WIDTH = 21;
exports.DASHBOARD_LRG_COL_WIDTH = 38;
exports.TABLE_WIDTH = 80;
exports.MARKER_WIDTH = 4;
const NUMBER_IN_EMAIL_REGEX = new RegExp("^\\d+\\+");
const dayFormat = "YYYY-MM-DD";
const dayTimeFormat = "LLLL";
let showStatusBarText = true;
let extensionName = null;
let workspace_name = null;
function getWorkspaceName() {
    if (!workspace_name) {
        workspace_name = randomCode();
    }
    return workspace_name;
}
exports.getWorkspaceName = getWorkspaceName;
function getPluginId() {
    return Constants_1.CODE_TIME_PLUGIN_ID;
}
exports.getPluginId = getPluginId;
function getPluginName() {
    return Constants_1.CODE_TIME_EXT_ID;
}
exports.getPluginName = getPluginName;
function getPluginType() {
    return Constants_1.CODE_TIME_TYPE;
}
exports.getPluginType = getPluginType;
function getVersion() {
    const extension = vscode_1.extensions.getExtension(Constants_1.CODE_TIME_EXT_ID);
    return extension.packageJSON.version;
}
exports.getVersion = getVersion;
function isCodeTimeMetricsFile(fileName) {
    fileName = fileName || "";
    if (fileName.includes(".software") && fileName.includes("CodeTime")) {
        return true;
    }
    return false;
}
exports.isCodeTimeMetricsFile = isCodeTimeMetricsFile;
function codeTimeExtInstalled() {
    const codeTimeExt = vscode_1.extensions.getExtension(Constants_1.CODE_TIME_EXT_ID);
    return codeTimeExt ? true : false;
}
exports.codeTimeExtInstalled = codeTimeExtInstalled;
function getSessionFileCreateTime() {
    let sessionFile = getSoftwareSessionFile();
    const stat = fs.statSync(sessionFile);
    if (stat.birthtime) {
        return stat.birthtime;
    }
    return stat.ctime;
}
exports.getSessionFileCreateTime = getSessionFileCreateTime;
function isGitProject(projectDir) {
    if (!projectDir) {
        return false;
    }
    if (!fs.existsSync(path.join(projectDir, ".git"))) {
        return false;
    }
    return true;
}
exports.isGitProject = isGitProject;
function isBatchSizeUnderThreshold(payloads) {
    const payloadDataLen = Buffer.byteLength(JSON.stringify(payloads));
    if (payloadDataLen <= 100000) {
        return true;
    }
    return false;
}
exports.isBatchSizeUnderThreshold = isBatchSizeUnderThreshold;
/**
 * This method is sync, no need to await on it.
 * @param file
 */
function getFileAgeInDays(file) {
    if (!fs.existsSync(file)) {
        return 0;
    }
    const stat = fs.statSync(file);
    let creationTimeSec = stat.birthtimeMs || stat.ctimeMs;
    // convert to seconds
    creationTimeSec /= 1000;
    const daysDiff = moment
        .duration(moment().diff(moment.unix(creationTimeSec)))
        .asDays();
    // if days diff is 0 then use 200, otherwise 100 per day, which is equal to a 9000 limit for 90 days
    return daysDiff > 1 ? parseInt(daysDiff, 10) : 1;
}
exports.getFileAgeInDays = getFileAgeInDays;
function getActiveProjectWorkspace() {
    const activeDocPath = findFirstActiveDirectoryOrWorkspaceDirectory();
    if (activeDocPath) {
        if (vscode_1.workspace.workspaceFolders &&
            vscode_1.workspace.workspaceFolders.length > 0) {
            for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
                const workspaceFolder = vscode_1.workspace.workspaceFolders[i];
                const folderPath = workspaceFolder.uri.fsPath;
                if (activeDocPath.indexOf(folderPath) !== -1) {
                    return workspaceFolder;
                }
            }
        }
    }
    return null;
}
exports.getActiveProjectWorkspace = getActiveProjectWorkspace;
function isFileActive(file, isCloseEvent = false) {
    if (isCloseEvent)
        return true;
    if (vscode_1.workspace.textDocuments) {
        for (let i = 0; i < vscode_1.workspace.textDocuments.length; i++) {
            const doc = vscode_1.workspace.textDocuments[i];
            if (doc && doc.fileName === file) {
                return true;
            }
        }
    }
    return false;
}
exports.isFileActive = isFileActive;
function findFirstActiveDirectoryOrWorkspaceDirectory() {
    if (getNumberOfTextDocumentsOpen() > 0) {
        // check if the .software/CodeTime has already been opened
        for (let i = 0; i < vscode_1.workspace.textDocuments.length; i++) {
            let docObj = vscode_1.workspace.textDocuments[i];
            if (docObj.fileName) {
                const dir = getRootPathForFile(docObj.fileName);
                if (dir) {
                    return dir;
                }
            }
        }
    }
    const folder = getFirstWorkspaceFolder();
    if (folder) {
        return folder.uri.fsPath;
    }
    return "";
}
exports.findFirstActiveDirectoryOrWorkspaceDirectory = findFirstActiveDirectoryOrWorkspaceDirectory;
/**
 * These will return the workspace folders.
 * use the uri.fsPath to get the full path
 * use the name to get the folder name
 */
function getWorkspaceFolders() {
    let folders = [];
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
            let workspaceFolder = vscode_1.workspace.workspaceFolders[i];
            let folderUri = workspaceFolder.uri;
            if (folderUri && folderUri.fsPath) {
                folders.push(workspaceFolder);
            }
        }
    }
    return folders;
}
exports.getWorkspaceFolders = getWorkspaceFolders;
function getFirstWorkspaceFolder() {
    const workspaceFolders = getWorkspaceFolders();
    if (workspaceFolders && workspaceFolders.length) {
        return workspaceFolders[0];
    }
    return null;
}
exports.getFirstWorkspaceFolder = getFirstWorkspaceFolder;
function getNumberOfTextDocumentsOpen() {
    return vscode_1.workspace.textDocuments ? vscode_1.workspace.textDocuments.length : 0;
}
exports.getNumberOfTextDocumentsOpen = getNumberOfTextDocumentsOpen;
function isFileOpen(fileName) {
    if (getNumberOfTextDocumentsOpen() > 0) {
        // check if the .software/CodeTime has already been opened
        for (let i = 0; i < vscode_1.workspace.textDocuments.length; i++) {
            let docObj = vscode_1.workspace.textDocuments[i];
            if (docObj.fileName && docObj.fileName === fileName) {
                return true;
            }
        }
    }
    return false;
}
exports.isFileOpen = isFileOpen;
function getRootPathForFile(fileName) {
    let folder = getProjectFolder(fileName);
    if (folder) {
        return folder.uri.fsPath;
    }
    return null;
}
exports.getRootPathForFile = getRootPathForFile;
function getWorkspaceFolderByPath(path) {
    let liveshareFolder = null;
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
            let workspaceFolder = vscode_1.workspace.workspaceFolders[i];
            if (path.includes(workspaceFolder.uri.fsPath)) {
                return workspaceFolder;
            }
        }
    }
    return null;
}
exports.getWorkspaceFolderByPath = getWorkspaceFolderByPath;
function getProjectFolder(fileName) {
    let liveshareFolder = null;
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
            let workspaceFolder = vscode_1.workspace.workspaceFolders[i];
            if (workspaceFolder.uri) {
                let isVslsScheme = workspaceFolder.uri.scheme === "vsls" ? true : false;
                if (isVslsScheme) {
                    liveshareFolder = workspaceFolder;
                }
                let folderUri = workspaceFolder.uri;
                if (folderUri &&
                    folderUri.fsPath &&
                    !isVslsScheme &&
                    fileName.includes(folderUri.fsPath)) {
                    return workspaceFolder;
                }
            }
        }
    }
    // wasn't found but if liveshareFolder was found, return that
    if (liveshareFolder) {
        return liveshareFolder;
    }
    return null;
}
exports.getProjectFolder = getProjectFolder;
function validateEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}
exports.validateEmail = validateEmail;
function setItem(key, value) {
    fileIt.setJsonValue(getSoftwareSessionFile(), key, value);
}
exports.setItem = setItem;
function getItem(key) {
    return fileIt.getJsonValue(getSoftwareSessionFile(), key);
}
exports.getItem = getItem;
function showLoading() {
    let loadingMsg = "⏳ code time metrics";
    updateStatusBar(loadingMsg, "");
}
exports.showLoading = showLoading;
function showStatus(fullMsg, tooltip) {
    if (!tooltip) {
        tooltip = "Active code time today. Click to see more from Code Time.";
    }
    updateStatusBar(fullMsg, tooltip);
}
exports.showStatus = showStatus;
function updateStatusBar(msg, tooltip) {
    let loggedInName = getItem("name");
    let userInfo = "";
    if (loggedInName && loggedInName !== "") {
        userInfo = ` Connected as ${loggedInName}`;
    }
    if (!tooltip) {
        tooltip = `Click to see more from Code Time`;
    }
    if (!showStatusBarText) {
        // add the message to the tooltip
        tooltip = msg + " | " + tooltip;
    }
    if (!extension_1.getStatusBarItem()) {
        return;
    }
    extension_1.getStatusBarItem().tooltip = `${tooltip}${userInfo}`;
    if (!showStatusBarText) {
        extension_1.getStatusBarItem().text = "$(clock)";
    }
    else {
        extension_1.getStatusBarItem().text = msg;
    }
}
function toggleStatusBar() {
    showStatusBarText = !showStatusBarText;
    SessionSummaryData_1.updateStatusBarWithSummaryData();
}
exports.toggleStatusBar = toggleStatusBar;
function isStatusBarTextVisible() {
    return showStatusBarText;
}
exports.isStatusBarTextVisible = isStatusBarTextVisible;
function isEmptyObj(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObj = isEmptyObj;
function isLinux() {
    return isWindows() || isMac() ? false : true;
}
exports.isLinux = isLinux;
// process.platform return the following...
//   -> 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
function isWindows() {
    return process.platform.indexOf("win32") !== -1;
}
exports.isWindows = isWindows;
function isMac() {
    return process.platform.indexOf("darwin") !== -1;
}
exports.isMac = isMac;
function getHostname() {
    return __awaiter(this, void 0, void 0, function* () {
        let hostname = yield getCommandResultLine("hostname");
        return hostname;
    });
}
exports.getHostname = getHostname;
function getOs() {
    let parts = [];
    let osType = os.type();
    if (osType) {
        parts.push(osType);
    }
    let osRelease = os.release();
    if (osRelease) {
        parts.push(osRelease);
    }
    let platform = os.platform();
    if (platform) {
        parts.push(platform);
    }
    if (parts.length > 0) {
        return parts.join("_");
    }
    return "";
}
exports.getOs = getOs;
function getCommandResultLine(cmd, projectDir = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultList = yield getCommandResultList(cmd, projectDir);
        let resultLine = "";
        if (resultList && resultList.length) {
            for (let i = 0; i < resultList.length; i++) {
                let line = resultList[i];
                if (line && line.trim().length > 0) {
                    resultLine = line.trim();
                    break;
                }
            }
        }
        return resultLine;
    });
}
exports.getCommandResultLine = getCommandResultLine;
function getCommandResultList(cmd, projectDir = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield wrapExecPromise(`${cmd}`, projectDir);
        if (!result) {
            return [];
        }
        const contentList = result
            .replace(/\r\n/g, "\r")
            .replace(/\n/g, "\r")
            .split(/\r/);
        return contentList;
    });
}
exports.getCommandResultList = getCommandResultList;
function getOsUsername() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = os.userInfo().username;
        if (!username || username.trim() === "") {
            username = yield getCommandResultLine("whoami");
        }
        return username;
    });
}
exports.getOsUsername = getOsUsername;
function getFile(name) {
    let file_path = getSoftwareDir();
    if (isWindows()) {
        return `${file_path}\\${name}`;
    }
    return `${file_path}/${name}`;
}
function getSoftwareSessionFile() {
    return getFile("session.json");
}
exports.getSoftwareSessionFile = getSoftwareSessionFile;
function getSoftwareDataStoreFile() {
    return getFile("data.json");
}
exports.getSoftwareDataStoreFile = getSoftwareDataStoreFile;
function getPluginEventsFile() {
    return getFile("events.json");
}
exports.getPluginEventsFile = getPluginEventsFile;
function getTimeCounterFile() {
    return getFile("timeCounter.json");
}
exports.getTimeCounterFile = getTimeCounterFile;
function getDashboardFile() {
    return getFile("CodeTime.txt");
}
exports.getDashboardFile = getDashboardFile;
function getCommitSummaryFile() {
    return getFile("CommitSummary.txt");
}
exports.getCommitSummaryFile = getCommitSummaryFile;
function getSummaryInfoFile() {
    return getFile("SummaryInfo.txt");
}
exports.getSummaryInfoFile = getSummaryInfoFile;
function getProjectCodeSummaryFile() {
    return getFile("ProjectCodeSummary.txt");
}
exports.getProjectCodeSummaryFile = getProjectCodeSummaryFile;
function getProjectContributorCodeSummaryFile() {
    return getFile("ProjectContributorCodeSummary.txt");
}
exports.getProjectContributorCodeSummaryFile = getProjectContributorCodeSummaryFile;
function getDailyReportSummaryFile() {
    return getFile("DailyReportSummary.txt");
}
exports.getDailyReportSummaryFile = getDailyReportSummaryFile;
function getSoftwareDir(autoCreate = true) {
    const homedir = os.homedir();
    let softwareDataDir = homedir;
    if (isWindows()) {
        softwareDataDir += "\\.software";
    }
    else {
        softwareDataDir += "/.software";
    }
    if (autoCreate && !fs.existsSync(softwareDataDir)) {
        fs.mkdirSync(softwareDataDir);
    }
    return softwareDataDir;
}
exports.getSoftwareDir = getSoftwareDir;
function softwareSessionFileExists() {
    // don't auto create the file
    const file = getSoftwareSessionFile();
    // check if it exists
    const sessionFileExists = fs.existsSync(file);
    return sessionFileExists;
}
exports.softwareSessionFileExists = softwareSessionFileExists;
function jwtExists() {
    let jwt = getItem("jwt");
    return !jwt ? false : true;
}
exports.jwtExists = jwtExists;
function getLocalREADMEFile() {
    const resourcePath = path.join(__dirname, "resources");
    const file = path.join(resourcePath, "README.md");
    return file;
}
exports.getLocalREADMEFile = getLocalREADMEFile;
function displayReadmeIfNotExists(override = false) {
    const displayedReadme = getItem("vscode_CtReadme");
    if (!displayedReadme || override) {
        const readmeUri = vscode_1.Uri.file(getLocalREADMEFile());
        vscode_1.commands.executeCommand("markdown.showPreview", readmeUri, vscode_1.ViewColumn.One);
        setItem("vscode_CtReadme", true);
    }
}
exports.displayReadmeIfNotExists = displayReadmeIfNotExists;
function openFileInEditor(file) {
    vscode_1.workspace.openTextDocument(file).then((doc) => {
        // Show open document and set focus
        vscode_1.window
            .showTextDocument(doc, 1, false)
            .then(undefined, (error) => {
            if (error.message) {
                vscode_1.window.showErrorMessage(error.message);
            }
            else {
                logIt(error);
            }
        });
    }, (error) => {
        if (error.message &&
            error.message.toLowerCase().includes("file not found")) {
            vscode_1.window.showErrorMessage(`Cannot open ${file}.  File not found.`);
        }
        else {
            logIt(error);
        }
    });
}
exports.openFileInEditor = openFileInEditor;
function getExtensionName() {
    if (extensionName) {
        return extensionName;
    }
    const resourcePath = path.join(__dirname, "resources");
    const extInfoFile = path.join(resourcePath, "extensioninfo.json");
    const extensionJson = fileIt.readJsonFileSync(extInfoFile);
    if (extensionJson) {
        extensionName = extensionJson.name;
    }
    if (!extensionName) {
        extensionName = "swdc-vscode";
    }
    return extensionName;
}
exports.getExtensionName = getExtensionName;
function logEvent(message) {
    const logEvents = DataController_1.getToggleFileEventLoggingState();
    if (logEvents) {
        console.log(`${getExtensionName()}: ${message}`);
    }
}
exports.logEvent = logEvent;
function logIt(message) {
    console.log(`${getExtensionName()}: ${message}`);
}
exports.logIt = logIt;
function showOfflinePrompt(addReconnectMsg = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // shows a prompt that we're not able to communicate with the app server
        let infoMsg = "Our service is temporarily unavailable. ";
        if (addReconnectMsg) {
            infoMsg +=
                "We will try to reconnect again in a minute. Your status bar will not update at this time.";
        }
        else {
            infoMsg += "Please try again later.";
        }
        // set the last update time so we don't try to ask too frequently
        vscode_1.window.showInformationMessage(infoMsg, ...["OK"]);
    });
}
exports.showOfflinePrompt = showOfflinePrompt;
function nowInSecs() {
    return Math.round(Date.now() / 1000);
}
exports.nowInSecs = nowInSecs;
function getOffsetSeconds() {
    let d = new Date();
    return d.getTimezoneOffset() * 60;
}
exports.getOffsetSeconds = getOffsetSeconds;
function getFormattedDay(unixSeconds) {
    return moment.unix(unixSeconds).format(dayFormat);
}
exports.getFormattedDay = getFormattedDay;
function isNewDay() {
    const { day } = getNowTimes();
    const currentDay = getItem("currentDay");
    return currentDay !== day ? true : false;
}
exports.isNewDay = isNewDay;
function coalesceNumber(val, defaultVal = 0) {
    if (val === null || val === undefined || isNaN(val)) {
        return defaultVal;
    }
    return val;
}
exports.coalesceNumber = coalesceNumber;
/**
 * now - current time in UTC (Moment object)
 * now_in_sec - current time in UTC, unix seconds
 * offset_in_sec - timezone offset from UTC (sign = -420 for Pacific Time)
 * local_now_in_sec - current time in UTC plus the timezone offset
 * utcDay - current day in UTC
 * day - current day in local TZ
 * localDayTime - current day in local TZ
 *
 * Example:
 * { day: "2020-04-07", localDayTime: "Tuesday, April 7, 2020 9:48 PM",
 * local_now_in_sec: 1586296107, now: "2020-04-08T04:48:27.120Z", now_in_sec: 1586321307,
 * offset_in_sec: -25200, utcDay: "2020-04-08" }
 */
function getNowTimes() {
    const now = moment.utc();
    const now_in_sec = now.unix();
    const offset_in_sec = moment().utcOffset() * 60;
    const local_now_in_sec = now_in_sec + offset_in_sec;
    const utcDay = now.format(dayFormat);
    const day = moment().format(dayFormat);
    const localDayTime = moment().format(dayTimeFormat);
    return {
        now,
        now_in_sec,
        offset_in_sec,
        local_now_in_sec,
        utcDay,
        day,
        localDayTime,
    };
}
exports.getNowTimes = getNowTimes;
function randomCode() {
    return crypto
        .randomBytes(16)
        .map((value) => exports.alpha.charCodeAt(Math.floor((value * exports.alpha.length) / 256)))
        .toString();
}
exports.randomCode = randomCode;
function deleteFile(file) {
    // if the file exists, get it
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}
exports.deleteFile = deleteFile;
function execPromise(command, opts) {
    return new Promise(function (resolve, reject) {
        exec(command, opts, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
function normalizeGithubEmail(email, filterOutNonEmails = true) {
    if (email) {
        if (filterOutNonEmails &&
            (email.endsWith("github.com") || email.includes("users.noreply"))) {
            return null;
        }
        else {
            const found = email.match(NUMBER_IN_EMAIL_REGEX);
            if (found && email.includes("users.noreply")) {
                // filter out the ones that look like
                // 2342353345+username@users.noreply.github.com"
                return null;
            }
        }
    }
    return email;
}
exports.normalizeGithubEmail = normalizeGithubEmail;
function wrapExecPromise(cmd, projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = null;
        try {
            let opts = projectDir !== undefined && projectDir !== null
                ? { cwd: projectDir }
                : {};
            result = yield execPromise(cmd, opts).catch((e) => {
                if (e.message) {
                    console.log(e.message);
                }
                return null;
            });
        }
        catch (e) {
            if (e.message) {
                console.log(e.message);
            }
            result = null;
        }
        return result;
    });
}
exports.wrapExecPromise = wrapExecPromise;
function launchWebUrl(url) {
    open(url);
}
exports.launchWebUrl = launchWebUrl;
/**
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 */
function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}
function formatNumber(num) {
    let str = "";
    num = num ? parseFloat(num) : 0;
    if (num >= 1000) {
        str = num.toLocaleString();
    }
    else if (num % 1 === 0) {
        str = num.toFixed(0);
    }
    else {
        str = num.toFixed(2);
    }
    return str;
}
exports.formatNumber = formatNumber;
/**
 * humanize the minutes
 */
function humanizeMinutes(min) {
    min = parseInt(min, 0) || 0;
    let str = "";
    if (min === 60) {
        str = "1 hr";
    }
    else if (min > 60) {
        let hrs = parseFloat(min) / 60;
        const roundedTime = roundUp(hrs, 1);
        str = roundedTime.toFixed(1) + " hrs";
    }
    else if (min === 1) {
        str = "1 min";
    }
    else {
        // less than 60 seconds
        str = min.toFixed(0) + " min";
    }
    return str;
}
exports.humanizeMinutes = humanizeMinutes;
function launchLogin(loginType = "software") {
    return __awaiter(this, void 0, void 0, function* () {
        // First check if they have already onboarded.
        // A user may not have completed the onboarding flow (letting
        // the web signup view stay open) by the time our lazy refetch
        // user status has given up.
        const result = yield DataController_1.getUserRegistrationState();
        if (result.loggedOn) {
            vscode_1.window.showInformationMessage("You are already logged in. Please wait...");
            return;
        }
        // continue with onboaring
        let loginUrl = yield buildLoginUrl(loginType);
        setItem("authType", loginType);
        launchWebUrl(loginUrl);
        // use the defaults
        DataController_1.refetchUserStatusLazily();
    });
}
exports.launchLogin = launchLogin;
/**
 * check if the user needs to see the login prompt or not
 */
function showLoginPrompt(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function* () {
        const infoMsg = `Finish creating your account and see rich data visualizations.`;
        // set the last update time so we don't try to ask too frequently
        const selection = yield vscode_1.window.showInformationMessage(infoMsg, { modal: true }, ...[Constants_1.LOGIN_LABEL]);
        let eventName = "";
        let eventType = "";
        if (selection === Constants_1.LOGIN_LABEL) {
            let loginUrl = yield buildLoginUrl(serverIsOnline);
            launchWebUrl(loginUrl);
            DataController_1.refetchUserStatusLazily();
            eventName = "click";
            eventType = "mouse";
        }
        else {
            // create an event showing login was not selected
            eventName = "close";
            eventType = "window";
        }
    });
}
exports.showLoginPrompt = showLoginPrompt;
function buildLoginUrl(loginType = "software") {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = getItem("jwt");
        if (!jwt) {
            // we should always have a jwt, but if not, create an anonymous account,
            // which will set the jwt, then use it to register
            yield AccountManager_1.createAnonymousUser();
            jwt = getItem("jwt");
        }
        const authType = getItem("authType");
        const encodedJwt = jwt ? encodeURIComponent(jwt) : null;
        let loginUrl = Constants_1.launch_url;
        if (encodedJwt) {
            if (loginType === "github") {
                // github signup/login flow
                loginUrl = `${Constants_1.api_endpoint}/auth/github?token=${encodedJwt}&plugin=${getPluginType()}&redirect=${Constants_1.launch_url}`;
            }
            else if (loginType === "google") {
                // google signup/login flow
                loginUrl = `${Constants_1.api_endpoint}/auth/google?token=${encodedJwt}&plugin=${getPluginType()}&redirect=${Constants_1.launch_url}`;
            }
            else if (!authType) {
                // never onboarded, show the signup view
                loginUrl = `${Constants_1.launch_url}/email-signup?token=${encodedJwt}&plugin=${getPluginType()}&auth=software`;
            }
            else {
                // they've already onboarded before, take them to the login page
                loginUrl = `${Constants_1.launch_url}/onboarding?token=${encodedJwt}&plugin=${getPluginType()}&auth=software&login=true`;
            }
        }
        return loginUrl;
    });
}
exports.buildLoginUrl = buildLoginUrl;
function connectAtlassian() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = getItem("jwt");
        if (!jwt) {
            // we should always have a jwt, but if not, create an anonymous account,
            // which will set the jwt, then use it to register
            yield AccountManager_1.createAnonymousUser();
            jwt = getItem("jwt");
        }
        const encodedJwt = encodeURIComponent(jwt);
        const connectAtlassianAuth = `${Constants_1.api_endpoint}/auth/atlassian?token=${jwt}&plugin=${getPluginType()}`;
        launchWebUrl(connectAtlassianAuth);
        OnboardManager_1.refetchAtlassianOauthLazily();
    });
}
exports.connectAtlassian = connectAtlassian;
function showInformationMessage(message) {
    return vscode_1.window.showInformationMessage(`${message}`);
}
exports.showInformationMessage = showInformationMessage;
function showWarningMessage(message) {
    return vscode_1.window.showWarningMessage(`${message}`);
}
exports.showWarningMessage = showWarningMessage;
function getDashboardRow(label, value, isSectionHeader = false) {
    const spacesRequired = exports.DASHBOARD_LABEL_WIDTH - label.length;
    const spaces = getSpaces(spacesRequired);
    const dashboardVal = getDashboardValue(value, isSectionHeader);
    let content = `${label}${spaces}${dashboardVal}\n`;
    if (isSectionHeader) {
        // add 3 to account for the " : " between the columns
        const dashLen = content.length;
        for (let i = 0; i < dashLen; i++) {
            content += "-";
        }
        content += "\n";
    }
    return content;
}
exports.getDashboardRow = getDashboardRow;
function getDashboardBottomBorder() {
    let content = "";
    const len = exports.DASHBOARD_LABEL_WIDTH + exports.DASHBOARD_VALUE_WIDTH;
    for (let i = 0; i < len; i++) {
        content += "-";
    }
    content += "\n\n";
    return content;
}
exports.getDashboardBottomBorder = getDashboardBottomBorder;
function getSectionHeader(label) {
    let content = `${label}\n`;
    // add 3 to account for the " : " between the columns
    let dashLen = exports.DASHBOARD_LABEL_WIDTH + exports.DASHBOARD_VALUE_WIDTH;
    for (let i = 0; i < dashLen; i++) {
        content += "-";
    }
    content += "\n";
    return content;
}
exports.getSectionHeader = getSectionHeader;
function formatRightAlignedTableLabel(label, col_width) {
    const spacesRequired = col_width - label.length;
    let spaces = "";
    if (spacesRequired > 0) {
        for (let i = 0; i < spacesRequired; i++) {
            spaces += " ";
        }
    }
    return `${spaces}${label}`;
}
function getTableHeader(leftLabel, rightLabel, isFullTable = true) {
    // get the space between the two labels
    const fullLen = !isFullTable
        ? exports.TABLE_WIDTH - exports.DASHBOARD_COL_WIDTH
        : exports.TABLE_WIDTH;
    const spacesRequired = fullLen - leftLabel.length - rightLabel.length;
    let spaces = "";
    if (spacesRequired > 0) {
        let str = "";
        for (let i = 0; i < spacesRequired; i++) {
            spaces += " ";
        }
    }
    return `${leftLabel}${spaces}${rightLabel}`;
}
exports.getTableHeader = getTableHeader;
function getRightAlignedTableHeader(label) {
    let content = `${formatRightAlignedTableLabel(label, exports.TABLE_WIDTH)}\n`;
    for (let i = 0; i < exports.TABLE_WIDTH; i++) {
        content += "-";
    }
    content += "\n";
    return content;
}
exports.getRightAlignedTableHeader = getRightAlignedTableHeader;
function getSpaces(spacesRequired) {
    let spaces = "";
    if (spacesRequired > 0) {
        let str = "";
        for (let i = 0; i < spacesRequired; i++) {
            spaces += " ";
        }
    }
    return spaces;
}
function getRowLabels(labels) {
    // for now 3 columns
    let content = "";
    let spacesRequired = 0;
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (i === 0) {
            content += label;
            // show a colon at the end of this column
            spacesRequired = exports.DASHBOARD_COL_WIDTH - content.length - 1;
            content += getSpaces(spacesRequired);
            content += ":";
        }
        else if (i === 1) {
            // middle column
            spacesRequired =
                exports.DASHBOARD_LRG_COL_WIDTH +
                    exports.DASHBOARD_COL_WIDTH -
                    content.length -
                    label.length -
                    1;
            content += getSpaces(spacesRequired);
            content += `${label} `;
        }
        else {
            // last column, get spaces until the end
            spacesRequired = exports.DASHBOARD_COL_WIDTH - label.length - 2;
            content += `| `;
            content += getSpaces(spacesRequired);
            content += label;
        }
    }
    content += "\n";
    return content;
}
exports.getRowLabels = getRowLabels;
function getColumnHeaders(labels) {
    // for now 3 columns
    let content = "";
    let spacesRequired = 0;
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (i === 0) {
            content += label;
        }
        else if (i === 1) {
            // middle column
            spacesRequired =
                exports.DASHBOARD_LRG_COL_WIDTH +
                    exports.DASHBOARD_COL_WIDTH -
                    content.length -
                    label.length -
                    1;
            content += getSpaces(spacesRequired);
            content += `${label} `;
        }
        else {
            // last column, get spaces until the end
            spacesRequired = exports.DASHBOARD_COL_WIDTH - label.length - 2;
            content += `| `;
            content += getSpaces(spacesRequired);
            content += label;
        }
    }
    content += "\n";
    for (let i = 0; i < exports.TABLE_WIDTH; i++) {
        content += "-";
    }
    content += "\n";
    return content;
}
exports.getColumnHeaders = getColumnHeaders;
function buildQueryString(obj) {
    let params = [];
    if (obj) {
        let keys = Object.keys(obj);
        if (keys && keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let val = obj[key];
                if (val && val !== undefined) {
                    let encodedVal = encodeURIComponent(val);
                    params.push(`${key}=${encodedVal}`);
                }
            }
        }
    }
    if (params.length > 0) {
        return "?" + params.join("&");
    }
    else {
        return "";
    }
}
exports.buildQueryString = buildQueryString;
function getDashboardLabel(label, width = exports.DASHBOARD_LABEL_WIDTH) {
    return getDashboardDataDisplay(width, label);
}
function getDashboardValue(value, isSectionHeader = false) {
    const spacesRequired = exports.DASHBOARD_VALUE_WIDTH - value.length - 2;
    let spaces = getSpaces(spacesRequired);
    if (!isSectionHeader) {
        return `: ${spaces}${value}`;
    }
    else {
        // we won't show the column divider in the header
        return `  ${spaces}${value}`;
    }
}
function getDashboardDataDisplay(widthLen, data) {
    let content = "";
    for (let i = 0; i < widthLen; i++) {
        content += " ";
    }
    return `${content}${data}`;
}
function createSpotifyIdFromUri(id) {
    if (id.indexOf("spotify:") === 0) {
        return id.substring(id.lastIndexOf(":") + 1);
    }
    return id;
}
exports.createSpotifyIdFromUri = createSpotifyIdFromUri;
function getFileType(fileName) {
    let fileType = "";
    const lastDotIdx = fileName.lastIndexOf(".");
    const len = fileName.length;
    if (lastDotIdx !== -1 && lastDotIdx < len - 1) {
        fileType = fileName.substring(lastDotIdx + 1);
    }
    return fileType;
}
exports.getFileType = getFileType;
function cleanJsonString(content) {
    content = content.replace(/\r\n/g, "").replace(/\n/g, "").trim();
    return content;
}
exports.cleanJsonString = cleanJsonString;
function getFileDataAsJson(file) {
    let data = fileIt.readJsonFileSync(file);
    return data;
}
exports.getFileDataAsJson = getFileDataAsJson;
function getFileDataArray(file) {
    let payloads = fileIt.readJsonArraySync(file);
    return payloads;
}
exports.getFileDataArray = getFileDataArray;
function getFileDataPayloadsAsJson(file) {
    // Still trying to find out when "undefined" is set into the data.json
    // but this will help remove it so we can process the json lines without failure
    let content = fileIt.readContentFileSync(file);
    if (content.indexOf("undefined") !== -1) {
        // remove "undefined" and re-save, then read (only found in the beginning of the content)
        content = content.replace("undefined", "");
        fileIt.writeContentFileSync(file, content);
    }
    let payloads = fileIt.readJsonLinesSync(file);
    return payloads;
}
exports.getFileDataPayloadsAsJson = getFileDataPayloadsAsJson;
//# sourceMappingURL=Util.js.map