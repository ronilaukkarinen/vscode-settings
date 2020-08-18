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
exports.storePayload = void 0;
const Util_1 = require("../Util");
const fileIt = require("file-it");
/**
 * this should only be called if there's file data in the source
 * @param payload
 */
function storePayload(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // make sure the data that is stored is valid
        if (payload && Object.keys(payload).length && Object.keys(payload.source).length) {
            // store the payload into the data.json file
            fileIt.appendJsonFileSync(Util_1.getSoftwareDataStoreFile(), payload);
        }
    });
}
exports.storePayload = storePayload;
//# sourceMappingURL=PayloadManager.js.map