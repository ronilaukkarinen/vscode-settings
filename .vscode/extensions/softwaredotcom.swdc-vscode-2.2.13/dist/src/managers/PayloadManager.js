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
exports.storePayload = exports.processPayload = void 0;
const Util_1 = require("../Util");
const os = require("os");
const fs = require("fs");
const path = require("path");
function processPayload(payload, sendNow = false) {
    return __awaiter(this, void 0, void 0, function* () {
        //
    });
}
exports.processPayload = processPayload;
/**
 * this should only be called if there's file data in the source
 * @param payload
 */
function storePayload(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // store the payload into the data.json file
        fs.appendFileSync(Util_1.getSoftwareDataStoreFile(), JSON.stringify(payload) + os.EOL, (err) => {
            if (err)
                Util_1.logIt(`Error appending to the Software data store file: ${err.message}`);
        });
    });
}
exports.storePayload = storePayload;
//# sourceMappingURL=PayloadManager.js.map