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
exports.isResponseOk = exports.hasTokenExpired = exports.softwareDelete = exports.softwarePost = exports.softwarePut = exports.softwareGet = exports.spotifyApiPut = exports.serverIsAvailable = void 0;
const axios_1 = require("axios");
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const CacheManager_1 = require("../cache/CacheManager");
// build the axios api base url
const beApi = axios_1.default.create({
    baseURL: `${Constants_1.api_endpoint}`,
    timeout: 15000
});
beApi.defaults.headers.common["X-SWDC-Plugin-Id"] = Util_1.getPluginId();
beApi.defaults.headers.common["X-SWDC-Plugin-Name"] = Util_1.getPluginName();
beApi.defaults.headers.common["X-SWDC-Plugin-Version"] = Util_1.getVersion();
beApi.defaults.headers.common["X-SWDC-Plugin-OS"] = Util_1.getOs();
beApi.defaults.headers.common["X-SWDC-Plugin-TZ"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
beApi.defaults.headers.common["X-SWDC-Plugin-Offset"] = Util_1.getOffsetSeconds() / 60;
const spotifyApi = axios_1.default.create({});
const cacheMgr = CacheManager_1.CacheManager.getInstance();
function serverIsAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        let isAvail = cacheMgr.get("serverAvailable");
        if (isAvail === undefined || isAvail === null) {
            isAvail = yield softwareGet("/ping", null)
                .then((result) => {
                return isResponseOk(result);
            })
                .catch((e) => {
                return false;
            });
            cacheMgr.set("serverAvailable", isAvail, 60);
        }
        return isAvail;
    });
}
exports.serverIsAvailable = serverIsAvailable;
function spotifyApiPut(api, payload, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (api.indexOf("https://api.spotify.com") === -1) {
            api = "https://api.spotify.com" + api;
        }
        spotifyApi.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        return yield spotifyApi.put(api, payload).catch((err) => {
            Util_1.logIt(`error posting data for ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.spotifyApiPut = spotifyApiPut;
/**
 * Response returns a paylod with the following...
 * data: <payload>, status: 200, statusText: "OK", config: Object
 * @param api
 * @param jwt
 */
function softwareGet(api, jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (jwt) {
            beApi.defaults.headers.common["Authorization"] = jwt;
        }
        return yield beApi.get(api).catch((err) => {
            Util_1.logIt(`error fetching data for ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.softwareGet = softwareGet;
/**
 * perform a put request
 */
function softwarePut(api, payload, jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        // PUT the kpm to the PluginManager
        beApi.defaults.headers.common["Authorization"] = jwt;
        return yield beApi
            .put(api, payload)
            .then((resp) => {
            return resp;
        })
            .catch((err) => {
            Util_1.logIt(`error posting data for ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.softwarePut = softwarePut;
/**
 * perform a post request
 */
function softwarePost(api, payload, jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        // POST the kpm to the PluginManager
        beApi.defaults.headers.common["Authorization"] = jwt;
        return beApi
            .post(api, payload)
            .then((resp) => {
            return resp;
        })
            .catch((err) => {
            Util_1.logIt(`error posting data for ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.softwarePost = softwarePost;
/**
 * perform a delete request
 */
function softwareDelete(api, jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        beApi.defaults.headers.common["Authorization"] = jwt;
        return beApi
            .delete(api)
            .then((resp) => {
            return resp;
        })
            .catch((err) => {
            Util_1.logIt(`error with delete request for ${api}, message: ${err.message}`);
            return err;
        });
    });
}
exports.softwareDelete = softwareDelete;
/**
 * Check if the spotify response has an expired token
 * {"error": {"status": 401, "message": "The access token expired"}}
 */
function hasTokenExpired(resp) {
    // when a token expires, we'll get the following error data
    // err.response.status === 401
    // err.response.statusText = "Unauthorized"
    if (resp &&
        resp.response &&
        resp.response.status &&
        resp.response.status === 401) {
        return true;
    }
    return false;
}
exports.hasTokenExpired = hasTokenExpired;
/**
 * check if the reponse is ok or not
 * axios always sends the following
 * status:200
 * statusText:"OK"
 *
    code:"ENOTFOUND"
    config:Object {adapter: , transformRequest: Object, transformResponse: Object, …}
    errno:"ENOTFOUND"
    host:"api.spotify.com"
    hostname:"api.spotify.com"
    message:"getaddrinfo ENOTFOUND api.spotify.com api.spotify.com:443"
    port:443
 */
function isResponseOk(resp) {
    let status = getResponseStatus(resp);
    if (status && resp && status < 300) {
        return true;
    }
    return false;
}
exports.isResponseOk = isResponseOk;
/**
 * get the response http status code
 * axios always sends the following
 * status:200
 * statusText:"OK"
 */
function getResponseStatus(resp) {
    let status = null;
    if (resp && resp.status) {
        status = resp.status;
    }
    else if (resp && resp.response && resp.response.status) {
        status = resp.response.status;
    }
    else if (resp && resp.code && resp.code === "ECONNABORTED") {
        status = 500;
    }
    return status;
}
//# sourceMappingURL=HttpClient.js.map