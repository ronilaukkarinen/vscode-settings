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
exports.downloadText = void 0;
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const nodeURL = require("url");
const server_1 = require("./server");
function downloadText(uri, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachePath = server_1.globalSettings.remoteCSSCachePath;
        if (cachePath !== "" && !nodeURL.parse(cachePath).protocol) {
            server_1.connection.window.showErrorMessage("Relative paths are not allowed in RemoteCSSCachePath setting");
            cachePath = "";
        }
        let cacheFile;
        if (cachePath !== "") {
            cacheFile = yield getCacheFile(uri, cachePath);
            if (cacheFile.type === "text") {
                return cacheFile.content;
            }
        }
        const request = mode === "http" ? http : https;
        return new Promise((resolve, reject) => {
            let temp = "";
            request
                .get(uri, (res) => __awaiter(this, void 0, void 0, function* () {
                if (res.statusCode !== 200) {
                    reject(new Error(`code ${res.statusCode}, ${uri}`));
                }
                const progress = yield server_1.connection.window.createWorkDoneProgress();
                const contentLength = res.headers["content-length"];
                if (!contentLength) {
                    reject(new Error(`content-length is undefined, ${uri}`));
                }
                const len = parseInt(contentLength);
                progress.begin(`download ${uri}`, 0, "", !server_1.globalSettings.silentDownload);
                res.on("data", (data) => {
                    temp += data;
                    progress.report((100 * temp.length) / len);
                }).on("end", () => __awaiter(this, void 0, void 0, function* () {
                    progress.done();
                    if (res.complete) {
                        if (cacheFile && cacheFile.type === "path") {
                            try {
                                yield fs.promises.mkdir(path.dirname(cacheFile.content), { recursive: true });
                                yield fs.promises.writeFile(cacheFile.content, temp);
                            }
                            catch (err) {
                                reject(err);
                            }
                        }
                        resolve(temp);
                    }
                    else {
                        resolve();
                    }
                }));
                progress.token.onCancellationRequested(() => {
                    res.destroy();
                });
            }))
                .on("error", (e) => {
                reject(e);
            });
        });
    });
}
exports.downloadText = downloadText;
function getCacheFile(uri, cachePath) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const url = nodeURL.parse(uri);
        const cacheFilePath = path.join(cachePath, (_a = url.hostname) !== null && _a !== void 0 ? _a : "", (_b = url.pathname) !== null && _b !== void 0 ? _b : "");
        try {
            return {
                type: "text",
                content: (yield fs.promises.readFile(cacheFilePath)).toString(),
            };
        }
        catch (err) {
            server_1.connection.console.log(`Failed to open file, redownload ${cacheFilePath}.`);
            return {
                type: "path",
                content: cacheFilePath,
            };
        }
    });
}
//# sourceMappingURL=remoteSupport.js.map