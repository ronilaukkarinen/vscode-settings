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
const vscode_1 = require("vscode");
class MusicCommandUtil {
    constructor() {
        //
    }
    static getInstance() {
        if (!MusicCommandUtil.instance) {
            MusicCommandUtil.instance = new MusicCommandUtil();
        }
        return MusicCommandUtil.instance;
    }
    runSpotifyCommand(fnc, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            if (args && args.length) {
                result = yield fnc(...args);
            }
            else {
                result = yield fnc();
            }
            if (this.isTooManyRequestsError(result)) {
                vscode_1.window.showErrorMessage("Currently experiencing frequent spotify requests, please try again soon.");
                return { status: 429 };
            }
            return result;
        });
    }
    isTooManyRequestsError(result) {
        return result &&
            result.error &&
            result.error.response &&
            result.error.response.status === 429
            ? true
            : false;
    }
}
exports.MusicCommandUtil = MusicCommandUtil;
//# sourceMappingURL=MusicCommandUtil.js.map