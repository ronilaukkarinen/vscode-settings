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
const vscode = require("vscode");
function showProgress(_target, _propertyKey, descriptor) {
    const fn = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                location: vscode.ProgressLocation.Window,
                title: 'GitHub'
            };
            return vscode.window.withProgress(options, () => __awaiter(this, void 0, void 0, function* () {
                return fn.call(this, ...args);
            }));
        });
    };
    return descriptor;
}
exports.showProgress = showProgress;
function getConfiguration(section, uri) {
    const config = vscode.workspace.getConfiguration(undefined, uri).get(section);
    if (!config) {
        throw new Error('Empty configuration. This is likely a bug.');
    }
    return config;
}
exports.getConfiguration = getConfiguration;
function getHostname(input) {
    const match = input.match(/.*?(?::\/\/|@)([^:\/]+)/);
    if (match) {
        return match[1];
    }
    return input;
}
exports.getHostname = getHostname;
//# sourceMappingURL=helper.js.map