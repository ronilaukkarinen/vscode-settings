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
exports.storeJsonData = exports.storeCurrentPayload = exports.getCurrentPayloadFile = exports.sendBatchPayload = exports.batchSendPayloadData = exports.getLastSavedKeystrokesStats = exports.batchSendData = exports.batchSendArrayData = exports.sendOfflineData = exports.sendOfflineTimeData = exports.clearLastSavedKeystrokeStats = void 0;
const HttpClient_1 = require("../http/HttpClient");
const Util_1 = require("../Util");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const fileIt = require("file-it");
const fs = require("fs");
// each file within the plugin data is about 1 to 2kb. the queue
// size limit is 256k. we should be able to safely send 50
// at a time, but the batch logic should check the size as well
const batch_limit = 50;
let latestPayload = null;
function clearLastSavedKeystrokeStats() {
    latestPayload = null;
}
exports.clearLastSavedKeystrokeStats = clearLastSavedKeystrokeStats;
/**
 * send the offline TimeData payloads
 */
function sendOfflineTimeData() {
    return __awaiter(this, void 0, void 0, function* () {
        batchSendArrayData("/data/time", TimeSummaryData_1.getTimeDataSummaryFile());
        // clear time data data. this will also clear the
        // code time and active code time numbers
        TimeSummaryData_1.clearTimeDataSummary();
    });
}
exports.sendOfflineTimeData = sendOfflineTimeData;
/**
 * send the offline data.
 */
function sendOfflineData() {
    return __awaiter(this, void 0, void 0, function* () {
        batchSendData("/data/batch", Util_1.getSoftwareDataStoreFile());
    });
}
exports.sendOfflineData = sendOfflineData;
/**
 * batch send array data
 * @param api
 * @param file
 */
function batchSendArrayData(api, file) {
    return __awaiter(this, void 0, void 0, function* () {
        let isonline = yield HttpClient_1.serverIsAvailable();
        if (!isonline) {
            return;
        }
        const payloads = Util_1.getFileDataArray(file);
        if (payloads && payloads.length) {
            batchSendPayloadData(api, file, payloads);
        }
    });
}
exports.batchSendArrayData = batchSendArrayData;
function batchSendData(api, file) {
    return __awaiter(this, void 0, void 0, function* () {
        let isonline = yield HttpClient_1.serverIsAvailable();
        if (!isonline) {
            return;
        }
        try {
            if (fs.existsSync(file)) {
                const payloads = Util_1.getFileDataPayloadsAsJson(file);
                batchSendPayloadData(api, file, payloads);
            }
        }
        catch (e) {
            Util_1.logIt(`Error batch sending payloads: ${e.message}`);
        }
    });
}
exports.batchSendData = batchSendData;
function getLastSavedKeystrokesStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const el = fileIt.findSortedJsonElement(Util_1.getSoftwareDataStoreFile(), "start", "desc");
        if (el) {
            return el;
        }
        // returns one in memory if not found in file
        return latestPayload;
    });
}
exports.getLastSavedKeystrokesStats = getLastSavedKeystrokesStats;
function batchSendPayloadData(api, file, payloads) {
    return __awaiter(this, void 0, void 0, function* () {
        // send the batch
        if (payloads && payloads.length > 0) {
            // Check to see if these payloads are the plugin payloads.
            // If so, check to see how many files are in each. We'll want to
            // break out the files into another payload if it exceeds what the
            // queue can handle in size, which is 256k. If it's not a plugin payload,
            // for example an event payload, then just make sure it's batched with
            // a limit of 100 or so to keep it under the 256k per POST request.
            Util_1.logIt(`sending batch payloads`);
            // send batch_limit at a time
            let batch = [];
            for (let i = 0; i < payloads.length; i++) {
                if (batch.length >= batch_limit) {
                    const resp = yield processBatch(api, batch);
                    if (!resp) {
                        // there was a problem with the transmission.
                        // bail out so we don't delete the offline data
                        return;
                    }
                    batch = [];
                }
                batch.push(payloads[i]);
            }
            // send the remaining
            if (batch.length > 0) {
                const resp = yield processBatch(api, batch);
                if (!resp) {
                    // there was a problem with the transmission.
                    // bail out so we don't delete the offline data
                    return;
                }
            }
        }
        // we're online so just delete the file
        Util_1.deleteFile(file);
    });
}
exports.batchSendPayloadData = batchSendPayloadData;
function processBatch(api, batch) {
    return __awaiter(this, void 0, void 0, function* () {
        const batchInfo = Buffer.byteLength(JSON.stringify(batch));
        // check if the batch data too large (256k is the max size but we'll use 250k)
        const isLargeFile = batchInfo >= 250000 ? true : false;
        if (isLargeFile) {
            // break these into their own batch size
            let newBatch = [];
            for (let x = 0; x < batch.length; x++) {
                const batchPayload = batch[x];
                // process the plugin data payloads one way
                if (batchPayload.source) {
                    // plugin data payload
                    const keys = Object.keys(batchPayload.source);
                    if (keys && keys.length) {
                        const sourceData = batchPayload.source;
                        delete batchPayload.source;
                        let newSource = {};
                        for (let y = 0; y < keys.length; y++) {
                            const fileName = keys[y];
                            if (Object.keys(newSource).length >= batch_limit) {
                                const newPayload = Object.assign(Object.assign({}, batchPayload), { source: newSource });
                                newBatch.push(newPayload);
                                // send the current new batch
                                const resp = yield sendBatchPayload(api, newBatch);
                                if (!HttpClient_1.isResponseOk(resp)) {
                                    // there was a problem with the transmission.
                                    // bail out so we don't delete the offline data
                                    return false;
                                }
                                newSource = {};
                                // clear the array
                                newBatch = [];
                            }
                            newSource[fileName] = Object.assign({}, sourceData[fileName]);
                        }
                        // process the remaining keys
                        if (Object.keys(newSource).length) {
                            const newPayload = Object.assign(Object.assign({}, batchPayload), { source: newSource });
                            newBatch.push(newPayload);
                            const resp = yield sendBatchPayload(api, newBatch);
                            if (!HttpClient_1.isResponseOk(resp)) {
                                // there was a problem with the transmission.
                                // bail out so we don't delete the offline data
                                return false;
                            }
                            // clear the array
                            newBatch = [];
                        }
                    }
                }
                else {
                    // process non-plugin data payloads another way
                    if (newBatch.length) {
                        if (!Util_1.isBatchSizeUnderThreshold(newBatch)) {
                            const resp = yield sendBatchPayload(api, newBatch);
                            if (!HttpClient_1.isResponseOk(resp)) {
                                // there was a problem with the transmission.
                                // bail out so we don't delete the offline data
                                return false;
                            }
                            // clear the array
                            newBatch = [];
                        }
                    }
                    newBatch.push(batchPayload);
                }
            }
            // send any remaining
            if (newBatch.length) {
                const resp = yield sendBatchPayload(api, newBatch);
                if (!HttpClient_1.isResponseOk(resp)) {
                    // there was a problem with the transmission.
                    // bail out so we don't delete the offline data
                    return false;
                }
            }
        }
        else {
            // the batch size is within bounds, send it off
            const resp = yield sendBatchPayload(api, batch);
            if (!HttpClient_1.isResponseOk(resp)) {
                // there was a problem with the transmission.
                // bail out so we don't delete the offline data
                return false;
            }
        }
        return true;
    });
}
function sendBatchPayload(api, batch) {
    return HttpClient_1.softwarePost(api, batch, Util_1.getItem("jwt")).catch((e) => {
        Util_1.logIt(`Unable to send plugin data batch, error: ${e.message}`);
    });
}
exports.sendBatchPayload = sendBatchPayload;
function getCurrentPayloadFile() {
    let file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\latestKeystrokes.json";
    }
    else {
        file += "/latestKeystrokes.json";
    }
    return file;
}
exports.getCurrentPayloadFile = getCurrentPayloadFile;
function storeCurrentPayload(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        storeJsonData(this.getCurrentPayloadFile(), payload);
    });
}
exports.storeCurrentPayload = storeCurrentPayload;
function storeJsonData(fileName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        fileIt.writeJsonFileSync(fileName, data);
    });
}
exports.storeJsonData = storeJsonData;
//# sourceMappingURL=FileManager.js.map