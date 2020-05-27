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
const fs = require("fs");
const path = require("path");
const os = require("os");
const request = require("request");
const tar = require("tar-fs");
let gunzip = require("gunzip-maybe");
const extension_1 = require("./extension");
const TARBALL_URL = "https://registry.npmjs.org/vscode-ripgrep/-/vscode-ripgrep-1.2.5.tgz";
function ensureStoragePath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(path)) {
                fs.mkdir(path, err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    });
}
function downloadVscodeRipgrep() {
    return __awaiter(this, void 0, void 0, function* () {
        const destination = path.join(extension_1.context.globalStoragePath, "vscode-ripgrep");
        if (!fs.existsSync(destination)) {
            yield new Promise((resolve, reject) => {
                fs.mkdir(destination, err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        }
        const stream = request(TARBALL_URL)
            .pipe(gunzip())
            .pipe(tar.extract(destination));
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve());
            stream.on("error", err => reject(err));
        });
    });
}
function runVscodeRipgrepInstaller() {
    return __awaiter(this, void 0, void 0, function* () {
        const download = require(path.join(extension_1.context.globalStoragePath, "vscode-ripgrep", "package", "lib", "download.js"));
        const opts = {
            platform: os.platform(),
            version: "0.10.0-pcre",
            arch: "unknown"
        };
        switch (opts.platform) {
            case "darwin":
                opts.arch = "x64";
                break;
            case "win32":
                opts.version = "0.10.0-patch.0";
                opts.arch = os.arch();
                break;
            case "linux":
                opts.arch = os.arch();
                break;
            default:
                throw new Error("Unknown platform: " + opts.platform);
        }
        return yield download(opts);
    });
}
function getRipgrepExecutablePath() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rg = require(path.join(extension_1.context.globalStoragePath, "vscode-ripgrep", "package", "lib", "index.js"));
            return rg.rgPath;
        }
        catch (error) {
            return null;
        }
    });
}
exports.getRipgrepExecutablePath = getRipgrepExecutablePath;
function ensureRipgrepInstalled() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ensureStoragePath(extension_1.context.globalStoragePath);
        if ((yield getRipgrepExecutablePath()) !== null) {
            return;
        }
        yield downloadVscodeRipgrep();
        yield runVscodeRipgrepInstaller();
    });
}
exports.ensureRipgrepInstalled = ensureRipgrepInstalled;
//# sourceMappingURL=ripgrep.js.map