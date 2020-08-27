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
exports.writeCodeTimeMetricsDashboard = exports.writeProjectContributorCommitDashboard = exports.writeProjectContributorCommitDashboardFromGitLogs = exports.writeProjectCommitDashboard = exports.writeProjectCommitDashboardByRangeType = exports.writeProjectCommitDashboardByStartEnd = exports.writeDailyReportDashboard = exports.writeCommitSummaryData = exports.launchWebDashboard = exports.sendHeartbeat = exports.refetchSlackConnectStatusLazily = exports.refetchUserStatusLazily = exports.updatePreferences = exports.initializePreferences = exports.getUser = exports.getSlackOauth = exports.isLoggedIn = exports.getUserRegistrationState = exports.getAppJwt = exports.sendTeamInvite = exports.getRegisteredTeamMembers = exports.getToggleFileEventLoggingState = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("./http/HttpClient");
const Util_1 = require("./Util");
const MenuManager_1 = require("./menu/MenuManager");
const Constants_1 = require("./Constants");
const SessionSummaryData_1 = require("./storage/SessionSummaryData");
const GitUtil_1 = require("./repo/GitUtil");
const TimeSummaryData_1 = require("./storage/TimeSummaryData");
const SummaryManager_1 = require("./managers/SummaryManager");
const fileIt = require("file-it");
const moment = require("moment-timezone");
let toggleFileEventLogging = null;
let slackFetchTimeout = null;
let userFetchTimeout = null;
function getToggleFileEventLoggingState() {
    if (toggleFileEventLogging === null) {
        toggleFileEventLogging = vscode_1.workspace
            .getConfiguration()
            .get("toggleFileEventLogging");
    }
    return toggleFileEventLogging;
}
exports.getToggleFileEventLoggingState = getToggleFileEventLoggingState;
function getRegisteredTeamMembers(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedIdentifier = encodeURIComponent(identifier);
        const api = `/repo/contributors?identifier=${encodedIdentifier}`;
        let teamMembers = [];
        // returns: [{email, name, identifier},..]
        const resp = yield HttpClient_1.softwareGet(api, Util_1.getItem("jwt"));
        if (HttpClient_1.isResponseOk(resp)) {
            teamMembers = resp.data;
        }
        return teamMembers;
    });
}
exports.getRegisteredTeamMembers = getRegisteredTeamMembers;
function sendTeamInvite(identifier, emails) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            identifier,
            emails,
        };
        const api = `/users/invite`;
        const resp = yield HttpClient_1.softwarePost(api, payload, Util_1.getItem("jwt"));
        if (HttpClient_1.isResponseOk(resp)) {
            vscode_1.window.showInformationMessage("Sent team invitation");
        }
        else {
            vscode_1.window.showErrorMessage(resp.data.message);
        }
    });
}
exports.sendTeamInvite = sendTeamInvite;
/**
 * get the app jwt
 */
function getAppJwt() {
    return __awaiter(this, void 0, void 0, function* () {
        // get the app jwt
        let resp = yield HttpClient_1.softwareGet(`/data/apptoken?token=${Util_1.nowInSecs()}`, null);
        if (HttpClient_1.isResponseOk(resp)) {
            return resp.data.jwt;
        }
        return null;
    });
}
exports.getAppJwt = getAppJwt;
function getUserRegistrationState() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        if (jwt) {
            let api = "/users/plugin/state";
            let resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp) && resp.data) {
                // NOT_FOUND, ANONYMOUS, OK, UNKNOWN
                let state = resp.data.state ? resp.data.state : "UNKNOWN";
                if (state === "OK") {
                    // set the authType based on...
                    // github_access_token, google_access_token, or password being true
                    if (resp.data.user) {
                        const user = resp.data.user;
                        if (user.github_access_token) {
                            Util_1.setItem("authType", "github");
                        }
                        else if (user.google_access_token) {
                            Util_1.setItem("authType", "google");
                        }
                        else {
                            Util_1.setItem("authType", "software");
                        }
                    }
                    let sessionEmail = Util_1.getItem("name");
                    let email = resp.data.email;
                    // set the name using the email
                    if (email && sessionEmail !== email) {
                        Util_1.setItem("name", email);
                    }
                    // check the jwt
                    let pluginJwt = resp.data.jwt;
                    if (pluginJwt && pluginJwt !== jwt) {
                        // update it
                        Util_1.setItem("jwt", pluginJwt);
                    }
                    // if we need the user it's "resp.data.user"
                    return { loggedOn: true, state };
                }
                // return the state that is returned
                return { loggedOn: false, state };
            }
        }
        // all else fails, set false and UNKNOWN
        return { loggedOn: false, state: "UNKNOWN" };
    });
}
exports.getUserRegistrationState = getUserRegistrationState;
/**
 * return whether the user is logged on or not
 * {loggedIn: true|false}
 */
function isLoggedIn() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = Util_1.getItem("name");
        const authType = Util_1.getItem("authType");
        if (name && authType) {
            return true;
        }
        const state = yield getUserRegistrationState();
        if (state.loggedOn) {
            initializePreferences();
        }
        return state.loggedOn;
    });
}
exports.isLoggedIn = isLoggedIn;
function getSlackOauth() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        if (jwt) {
            let user = yield getUser(jwt);
            if (user && user.auths) {
                // get the one that is "slack"
                for (let i = 0; i < user.auths.length; i++) {
                    if (user.auths[i].type === "slack") {
                        Util_1.setItem("slack_access_token", user.auths[i].access_token);
                        return user.auths[i];
                    }
                }
            }
        }
    });
}
exports.getSlackOauth = getSlackOauth;
function getUser(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (jwt) {
            let api = `/users/me`;
            let resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp)) {
                if (resp && resp.data && resp.data.data) {
                    const user = resp.data.data;
                    if (user.registered === 1) {
                        // update jwt to what the jwt is for this spotify user
                        Util_1.setItem("name", user.email);
                    }
                    return user;
                }
            }
        }
        return null;
    });
}
exports.getUser = getUser;
function initializePreferences() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        // use a default if we're unable to get the user or preferences
        let sessionThresholdInSec = Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
        if (jwt) {
            let user = yield getUser(jwt);
            if (user && user.preferences) {
                // obtain the session threshold in seconds "sessionThresholdInSec"
                sessionThresholdInSec =
                    user.preferences.sessionThresholdInSec ||
                        Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
                let userId = parseInt(user.id, 10);
                let prefs = user.preferences;
                let prefsShowGit = prefs.showGit !== null && prefs.showGit !== undefined
                    ? prefs.showGit
                    : null;
                let prefsShowRank = prefs.showRank !== null && prefs.showRank !== undefined
                    ? prefs.showRank
                    : null;
                if (prefsShowGit === null || prefsShowRank === null) {
                    yield sendPreferencesUpdate(userId, prefs);
                }
                else {
                    if (prefsShowGit !== null) {
                        yield vscode_1.workspace
                            .getConfiguration()
                            .update("showGitMetrics", prefsShowGit, vscode_1.ConfigurationTarget.Global);
                    }
                    if (prefsShowRank !== null) {
                        // await workspace
                        //     .getConfiguration()
                        //     .update(
                        //         "showWeeklyRanking",
                        //         prefsShowRank,
                        //         ConfigurationTarget.Global
                        //     );
                    }
                }
            }
        }
        // update the session threshold in seconds config
        Util_1.setItem("sessionThresholdInSec", sessionThresholdInSec);
    });
}
exports.initializePreferences = initializePreferences;
function sendPreferencesUpdate(userId, userPrefs) {
    return __awaiter(this, void 0, void 0, function* () {
        let api = `/users/${userId}`;
        let showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
        // let showWeeklyRanking = workspace
        //     .getConfiguration()
        //     .get("showWeeklyRanking");
        userPrefs["showGit"] = showGitMetrics;
        // userPrefs["showRank"] = showWeeklyRanking;
        // update the preferences
        // /:id/preferences
        api = `/users/${userId}/preferences`;
        let resp = yield HttpClient_1.softwarePut(api, userPrefs, Util_1.getItem("jwt"));
        if (HttpClient_1.isResponseOk(resp)) {
            Util_1.logIt("update user code time preferences");
        }
    });
}
function updatePreferences() {
    return __awaiter(this, void 0, void 0, function* () {
        toggleFileEventLogging = vscode_1.workspace
            .getConfiguration()
            .get("toggleFileEventLogging");
        let showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
        // let showWeeklyRanking = workspace
        //     .getConfiguration()
        //     .get("showWeeklyRanking");
        // get the user's preferences and update them if they don't match what we have
        let jwt = Util_1.getItem("jwt");
        if (jwt) {
            let user = yield getUser(jwt);
            if (!user) {
                return;
            }
            let api = `/users/${user.id}`;
            let resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp)) {
                if (resp &&
                    resp.data &&
                    resp.data.data &&
                    resp.data.data.preferences) {
                    let prefs = resp.data.data.preferences;
                    let prefsShowGit = prefs.showGit !== null && prefs.showGit !== undefined
                        ? prefs.showGit
                        : null;
                    if (prefsShowGit === null || prefsShowGit !== showGitMetrics) {
                        yield sendPreferencesUpdate(parseInt(user.id, 10), prefs);
                    }
                }
            }
        }
    });
}
exports.updatePreferences = updatePreferences;
function refetchUserStatusLazily(tryCountUntilFoundUser = 50, interval = 10000) {
    if (userFetchTimeout) {
        return;
    }
    userFetchTimeout = setTimeout(() => {
        userFetchTimeout = null;
        userStatusFetchHandler(tryCountUntilFoundUser, interval);
    }, interval);
}
exports.refetchUserStatusLazily = refetchUserStatusLazily;
function userStatusFetchHandler(tryCountUntilFoundUser, interval) {
    return __awaiter(this, void 0, void 0, function* () {
        let loggedIn = yield isLoggedIn();
        if (!loggedIn) {
            // try again if the count is not zero
            if (tryCountUntilFoundUser > 0) {
                tryCountUntilFoundUser -= 1;
                refetchUserStatusLazily(tryCountUntilFoundUser, interval);
            }
        }
        else {
            sendHeartbeat(`STATE_CHANGE:LOGGED_IN:true`);
            SessionSummaryData_1.clearSessionSummaryData();
            const message = "Successfully logged on to Code Time";
            vscode_1.window.showInformationMessage(message);
            vscode_1.commands.executeCommand("codetime.sendOfflineData");
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
                vscode_1.commands.executeCommand("codetime.refreshTreeViews");
            }), 5000);
        }
    });
}
function refetchSlackConnectStatusLazily(callback, tryCountUntilFound = 40) {
    if (slackFetchTimeout) {
        return;
    }
    slackFetchTimeout = setTimeout(() => {
        slackFetchTimeout = null;
        slackConnectStatusHandler(callback, tryCountUntilFound);
    }, 10000);
}
exports.refetchSlackConnectStatusLazily = refetchSlackConnectStatusLazily;
function slackConnectStatusHandler(callback, tryCountUntilFound) {
    return __awaiter(this, void 0, void 0, function* () {
        let oauth = yield getSlackOauth();
        if (!oauth) {
            // try again if the count is not zero
            if (tryCountUntilFound > 0) {
                tryCountUntilFound -= 1;
                refetchSlackConnectStatusLazily(callback, tryCountUntilFound);
            }
        }
        else {
            vscode_1.window.showInformationMessage(`Successfully connected to Slack`);
            if (callback) {
                callback();
            }
        }
    });
}
function sendHeartbeat(reason) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        if (jwt) {
            let heartbeat = {
                pluginId: Util_1.getPluginId(),
                os: Util_1.getOs(),
                start: Util_1.nowInSecs(),
                version: Util_1.getVersion(),
                hostname: yield Util_1.getHostname(),
                session_ctime: Util_1.getSessionFileCreateTime(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                trigger_annotation: reason,
                editor_token: Util_1.getWorkspaceName(),
            };
            let api = `/data/heartbeat`;
            HttpClient_1.softwarePost(api, heartbeat, jwt).then((resp) => __awaiter(this, void 0, void 0, function* () {
                if (!HttpClient_1.isResponseOk(resp)) {
                    Util_1.logIt("unable to send heartbeat ping");
                }
            }));
        }
    });
}
exports.sendHeartbeat = sendHeartbeat;
function launchWebDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        // {loggedIn: true|false}
        let loggedIn = yield isLoggedIn();
        let webUrl = yield MenuManager_1.buildWebDashboardUrl();
        if (!loggedIn) {
            webUrl = yield Util_1.buildLoginUrl();
            refetchUserStatusLazily();
        }
        else {
            // add the token=jwt
            const jwt = Util_1.getItem("jwt");
            const encodedJwt = encodeURIComponent(jwt);
            webUrl = `${webUrl}?token=${encodedJwt}`;
        }
        Util_1.launchWebUrl(webUrl);
    });
}
exports.launchWebDashboard = launchWebDashboard;
function writeCommitSummaryData() {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = Util_1.getCommitSummaryFile();
        const result = yield HttpClient_1.softwareGet(`/dashboard/commits`, Util_1.getItem("jwt")).catch((err) => {
            return null;
        });
        let content = "WEEKLY COMMIT SUMMARY";
        if (HttpClient_1.isResponseOk(result) && result.data) {
            // get the string content out
            content = result.data;
        }
        fileIt.writeContentFileSync(filePath, content);
    });
}
exports.writeCommitSummaryData = writeCommitSummaryData;
function writeDailyReportDashboard(type = "yesterday", projectIds = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let dashboardContent = "";
        const file = Util_1.getDailyReportSummaryFile();
        fileIt.writeContentFileSync(file, dashboardContent);
    });
}
exports.writeDailyReportDashboard = writeDailyReportDashboard;
function writeProjectCommitDashboardByStartEnd(start, end, projectIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const qryStr = `?start=${start}&end=${end}&projectIds=${projectIds.join(",")}`;
        const api = `/projects/codeSummary${qryStr}`;
        const result = yield HttpClient_1.softwareGet(api, Util_1.getItem("jwt"));
        const { rangeStart, rangeEnd } = createStartEndRangeByTimestamps(start, end);
        yield writeProjectCommitDashboard(result, rangeStart, rangeEnd);
    });
}
exports.writeProjectCommitDashboardByStartEnd = writeProjectCommitDashboardByStartEnd;
function writeProjectCommitDashboardByRangeType(type = "lastWeek", projectIds) {
    return __awaiter(this, void 0, void 0, function* () {
        projectIds = projectIds.filter((n) => n);
        const qryStr = `?timeRange=${type}&projectIds=${projectIds.join(",")}`;
        const api = `/projects/codeSummary${qryStr}`;
        const result = yield HttpClient_1.softwareGet(api, Util_1.getItem("jwt"));
        // create the header
        const { rangeStart, rangeEnd } = createStartEndRangeByType(type);
        yield writeProjectCommitDashboard(result, rangeStart, rangeEnd);
    });
}
exports.writeProjectCommitDashboardByRangeType = writeProjectCommitDashboardByRangeType;
function writeProjectCommitDashboard(apiResult, rangeStart, rangeEnd) {
    return __awaiter(this, void 0, void 0, function* () {
        let dashboardContent = "";
        // [{projectId, name, identifier, commits, files_changed, insertions, deletions, hours,
        //   keystrokes, characters_added, characters_deleted, lines_added, lines_removed},...]
        if (HttpClient_1.isResponseOk(apiResult)) {
            let codeCommitData = apiResult.data;
            // create the title
            const formattedDate = moment().format("ddd, MMM Do h:mma");
            dashboardContent = `CODE TIME PROJECT SUMMARY     (Last updated on ${formattedDate})`;
            dashboardContent += "\n\n";
            if (codeCommitData && codeCommitData.length) {
                // filter out null project names
                codeCommitData = codeCommitData.filter((n) => n.name);
                codeCommitData.forEach((el) => {
                    dashboardContent += Util_1.getDashboardRow(el.name, `${rangeStart} to ${rangeEnd}`, true);
                    // hours
                    const hours = Util_1.humanizeMinutes(el.session_seconds / 60);
                    dashboardContent += Util_1.getDashboardRow("Code time", hours);
                    // keystrokes
                    const keystrokes = el.keystrokes
                        ? Util_1.formatNumber(el.keystrokes)
                        : Util_1.formatNumber(0);
                    dashboardContent += Util_1.getDashboardRow("Keystrokes", keystrokes);
                    // commits
                    const commits = el.commits
                        ? Util_1.formatNumber(el.commits)
                        : Util_1.formatNumber(0);
                    dashboardContent += Util_1.getDashboardRow("Commits", commits);
                    // files_changed
                    const files_changed = el.files_changed
                        ? Util_1.formatNumber(el.files_changed)
                        : Util_1.formatNumber(0);
                    dashboardContent += Util_1.getDashboardRow("Files changed", files_changed);
                    // insertions
                    const insertions = el.insertions
                        ? Util_1.formatNumber(el.insertions)
                        : Util_1.formatNumber(0);
                    dashboardContent += Util_1.getDashboardRow("Insertions", insertions);
                    // deletions
                    const deletions = el.deletions
                        ? Util_1.formatNumber(el.deletions)
                        : Util_1.formatNumber(0);
                    dashboardContent += Util_1.getDashboardRow("Deletions", deletions);
                    dashboardContent += Util_1.getDashboardBottomBorder();
                });
            }
            else {
                dashboardContent += "No data available";
            }
            dashboardContent += "\n";
        }
        const file = Util_1.getProjectCodeSummaryFile();
        fileIt.writeContentFileSync(file, dashboardContent);
    });
}
exports.writeProjectCommitDashboard = writeProjectCommitDashboard;
function writeProjectContributorCommitDashboardFromGitLogs(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeRootPath = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
        const userTodaysChangeStatsP = GitUtil_1.getTodaysCommits(activeRootPath);
        const userYesterdaysChangeStatsP = GitUtil_1.getYesterdaysCommits(activeRootPath);
        const userWeeksChangeStatsP = GitUtil_1.getThisWeeksCommits(activeRootPath);
        const contributorsTodaysChangeStatsP = GitUtil_1.getTodaysCommits(activeRootPath, false);
        const contributorsYesterdaysChangeStatsP = GitUtil_1.getYesterdaysCommits(activeRootPath, false);
        const contributorsWeeksChangeStatsP = GitUtil_1.getThisWeeksCommits(activeRootPath, false);
        let dashboardContent = "";
        const now = moment().unix();
        const formattedDate = moment.unix(now).format("ddd, MMM Do h:mma");
        dashboardContent = Util_1.getTableHeader("PROJECT SUMMARY", ` (Last updated on ${formattedDate})`);
        dashboardContent += "\n\n";
        dashboardContent += `Project: ${identifier}`;
        dashboardContent += "\n\n";
        // TODAY
        let projectDate = moment.unix(now).format("MMM Do, YYYY");
        dashboardContent += Util_1.getRightAlignedTableHeader(`Today (${projectDate})`);
        dashboardContent += Util_1.getColumnHeaders(["Metric", "You", "All Contributors"]);
        let summary = {
            activity: yield userTodaysChangeStatsP,
            contributorActivity: yield contributorsTodaysChangeStatsP,
        };
        dashboardContent += getRowNumberData(summary, "Commits", "commitCount");
        // files changed
        dashboardContent += getRowNumberData(summary, "Files changed", "fileCount");
        // insertions
        dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
        // deletions
        dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
        dashboardContent += "\n";
        // YESTERDAY
        projectDate = moment.unix(now).format("MMM Do, YYYY");
        let startDate = moment
            .unix(now)
            .subtract(1, "day")
            .startOf("day")
            .format("MMM Do, YYYY");
        dashboardContent += Util_1.getRightAlignedTableHeader(`Yesterday (${startDate})`);
        dashboardContent += Util_1.getColumnHeaders(["Metric", "You", "All Contributors"]);
        summary = {
            activity: yield userYesterdaysChangeStatsP,
            contributorActivity: yield contributorsYesterdaysChangeStatsP,
        };
        dashboardContent += getRowNumberData(summary, "Commits", "commitCount");
        // files changed
        dashboardContent += getRowNumberData(summary, "Files changed", "fileCount");
        // insertions
        dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
        // deletions
        dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
        dashboardContent += "\n";
        // THIS WEEK
        projectDate = moment.unix(now).format("MMM Do, YYYY");
        startDate = moment.unix(now).startOf("week").format("MMM Do, YYYY");
        dashboardContent += Util_1.getRightAlignedTableHeader(`This week (${startDate} to ${projectDate})`);
        dashboardContent += Util_1.getColumnHeaders(["Metric", "You", "All Contributors"]);
        summary = {
            activity: yield userWeeksChangeStatsP,
            contributorActivity: yield contributorsWeeksChangeStatsP,
        };
        dashboardContent += getRowNumberData(summary, "Commits", "commitCount");
        // files changed
        dashboardContent += getRowNumberData(summary, "Files changed", "fileCount");
        // insertions
        dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
        // deletions
        dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
        dashboardContent += "\n";
        const file = Util_1.getProjectContributorCodeSummaryFile();
        fileIt.writeContentFileSync(file, dashboardContent);
    });
}
exports.writeProjectContributorCommitDashboardFromGitLogs = writeProjectContributorCommitDashboardFromGitLogs;
function writeProjectContributorCommitDashboard(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const qryStr = `?identifier=${encodeURIComponent(identifier)}`;
        const api = `/projects/contributorSummary${qryStr}`;
        const result = yield HttpClient_1.softwareGet(api, Util_1.getItem("jwt"));
        let dashboardContent = "";
        // [{timestamp, activity, contributorActivity},...]
        // the activity and contributorActivity will have the following structure
        // [{projectId, name, identifier, commits, files_changed, insertions, deletions, hours,
        //   keystrokes, characters_added, characters_deleted, lines_added, lines_removed},...]
        if (HttpClient_1.isResponseOk(result)) {
            const data = result.data;
            // create the title
            const now = moment().unix();
            const formattedDate = moment.unix(now).format("ddd, MMM Do h:mma");
            dashboardContent = Util_1.getTableHeader("PROJECT SUMMARY", ` (Last updated on ${formattedDate})`);
            dashboardContent += "\n\n";
            dashboardContent += `Project: ${identifier}`;
            dashboardContent += "\n\n";
            for (let i = 0; i < data.length; i++) {
                const summary = data[i];
                let projectDate = moment.unix(now).format("MMM Do, YYYY");
                if (i === 0) {
                    projectDate = `Today (${projectDate})`;
                }
                else if (i === 1) {
                    let startDate = moment
                        .unix(now)
                        .startOf("week")
                        .format("MMM Do, YYYY");
                    projectDate = `This week (${startDate} to ${projectDate})`;
                }
                else {
                    let startDate = moment
                        .unix(now)
                        .startOf("month")
                        .format("MMM Do, YYYY");
                    projectDate = `This month (${startDate} to ${projectDate})`;
                }
                dashboardContent += Util_1.getRightAlignedTableHeader(projectDate);
                dashboardContent += Util_1.getColumnHeaders([
                    "Metric",
                    "You",
                    "All Contributors",
                ]);
                // show the metrics now
                // const userHours = summary.activity.session_seconds
                //     ? humanizeMinutes(summary.activity.session_seconds / 60)
                //     : humanizeMinutes(0);
                // const contribHours = summary.contributorActivity.session_seconds
                //     ? humanizeMinutes(
                //           summary.contributorActivity.session_seconds / 60
                //       )
                //     : humanizeMinutes(0);
                // dashboardContent += getRowLabels([
                //     "Code time",
                //     userHours,
                //     contribHours
                // ]);
                // commits
                dashboardContent += getRowNumberData(summary, "Commits", "commits");
                // files changed
                dashboardContent += getRowNumberData(summary, "Files changed", "files_changed");
                // insertions
                dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
                // deletions
                dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
                dashboardContent += "\n";
            }
            dashboardContent += "\n";
        }
        const file = Util_1.getProjectContributorCodeSummaryFile();
        fileIt.writeContentFileSync(file, dashboardContent);
    });
}
exports.writeProjectContributorCommitDashboard = writeProjectContributorCommitDashboard;
function getRowNumberData(summary, title, attribute) {
    // files changed
    const userFilesChanged = summary.activity[attribute]
        ? Util_1.formatNumber(summary.activity[attribute])
        : Util_1.formatNumber(0);
    const contribFilesChanged = summary.contributorActivity[attribute]
        ? Util_1.formatNumber(summary.contributorActivity[attribute])
        : Util_1.formatNumber(0);
    return Util_1.getRowLabels([title, userFilesChanged, contribFilesChanged]);
}
// start and end should be local_start and local_end
function createStartEndRangeByTimestamps(start, end) {
    return {
        rangeStart: moment.unix(start).utc().format("MMM Do, YYYY"),
        rangeEnd: moment.unix(end).utc().format("MMM Do, YYYY"),
    };
}
function createStartEndRangeByType(type = "lastWeek") {
    // default to "lastWeek"
    let startOf = moment().startOf("week").subtract(1, "week");
    let endOf = moment().startOf("week").subtract(1, "week").endOf("week");
    if (type === "yesterday") {
        startOf = moment().subtract(1, "day").startOf("day");
        endOf = moment().subtract(1, "day").endOf("day");
    }
    else if (type === "currentWeek") {
        startOf = moment().startOf("week");
        endOf = moment();
    }
    else if (type === "lastMonth") {
        startOf = moment().subtract(1, "month").startOf("month");
        endOf = moment().subtract(1, "month").endOf("month");
    }
    return {
        rangeStart: startOf.format("MMM Do, YYYY"),
        rangeEnd: endOf.format("MMM Do, YYYY"),
    };
}
function writeCodeTimeMetricsDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const summaryInfoFile = Util_1.getSummaryInfoFile();
        // write the code time metrics summary to the summaryInfo file
        let showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
        let api = `/dashboard?showMusic=false&showGit=${showGitMetrics}&showRank=false&linux=${Util_1.isLinux()}&showToday=false`;
        const result = yield HttpClient_1.softwareGet(api, Util_1.getItem("jwt"));
        if (HttpClient_1.isResponseOk(result)) {
            // get the string content out
            const content = result.data;
            fileIt.writeContentFileSync(summaryInfoFile, content);
        }
        // create the header
        let dashboardContent = "";
        const formattedDate = moment().format("ddd, MMM Do h:mma");
        dashboardContent = `CODE TIME          (Last updated on ${formattedDate})`;
        dashboardContent += "\n\n";
        const todayStr = moment().format("ddd, MMM Do");
        dashboardContent += Util_1.getSectionHeader(`Today (${todayStr})`);
        const codeTimeSummary = TimeSummaryData_1.getCodeTimeSummary();
        // get the top section of the dashboard content (today's data)
        const sessionSummary = SessionSummaryData_1.getSessionSummaryData();
        if (sessionSummary) {
            const averageTimeStr = Util_1.humanizeMinutes(sessionSummary.averageDailyMinutes);
            // code time today
            const codeTimeToday = Util_1.humanizeMinutes(codeTimeSummary.codeTimeMinutes);
            const activeCodeTimeToday = Util_1.humanizeMinutes(codeTimeSummary.activeCodeTimeMinutes);
            let liveshareTimeStr = null;
            if (sessionSummary.liveshareMinutes) {
                liveshareTimeStr = Util_1.humanizeMinutes(sessionSummary.liveshareMinutes);
            }
            dashboardContent += Util_1.getDashboardRow("Code time today", codeTimeToday);
            dashboardContent += Util_1.getDashboardRow("Active code time today", activeCodeTimeToday);
            dashboardContent += Util_1.getDashboardRow("90-day avg", averageTimeStr);
            if (liveshareTimeStr) {
                dashboardContent += Util_1.getDashboardRow("Live Share", liveshareTimeStr);
            }
            dashboardContent += "\n";
        }
        // get the summary info we just made a call for and add it to the dashboard content
        const summaryContent = fileIt.readContentFileSync(summaryInfoFile);
        if (summaryContent) {
            // create the dashboard file
            dashboardContent += summaryContent;
        }
        // now write it all out to the dashboard file
        const dashboardFile = Util_1.getDashboardFile();
        fileIt.writeContentFileSync(dashboardFile, dashboardContent);
    });
}
exports.writeCodeTimeMetricsDashboard = writeCodeTimeMetricsDashboard;
//# sourceMappingURL=DataController.js.map