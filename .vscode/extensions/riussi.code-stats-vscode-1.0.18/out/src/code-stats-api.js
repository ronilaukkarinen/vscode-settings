"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const axios = require("axios");
class CodeStatsAPI {
    constructor(apiKey, apiURL, userName) {
        this.API_KEY = null;
        this.USER_NAME = null;
        this.UPDATE_URL = "https://codestats.net/api/";
        this.axios = null;
        this.updateSettings(apiKey, apiURL, userName);
    }
    updateSettings(apiKey, apiURL, userName) {
        this.API_KEY = apiKey;
        this.UPDATE_URL = apiURL;
        this.USER_NAME = userName;
        if (this.API_KEY === null ||
            this.API_KEY === undefined ||
            this.API_KEY === "") {
            return;
        }
        this.axios = axios.default.create({
            baseURL: this.UPDATE_URL,
            timeout: 10000,
            headers: {
                "X-API-Token": this.API_KEY,
                "Content-Type": "application/json"
            }
        });
    }
    sendUpdate(pulse) {
        // If we did not have API key, don't try to update
        if (this.axios === null) {
            return null;
        }
        // tslint:disable-next-line:typedef
        const data = new ApiJSON(new Date());
        for (let lang of pulse.xps.keys()) {
            let languageName = utils_1.getLanguageName(lang);
            let xp = pulse.getXP(lang);
            data.xps.push(new ApiXP(languageName, xp));
        }
        let json = JSON.stringify(data);
        console.log(`JSON: ${json}`);
        return this.axios
            .post("my/pulses", json)
            .then(response => {
            console.log(response);
        })
            .then(() => {
            pulse.reset();
        })
            .catch(error => {
            console.log(error);
        });
    }
    getProfile() {
        return this.axios
            .get(`users/${this.USER_NAME}`)
            .then(response => {
            return response.data;
        })
            .catch(error => {
            console.log(error);
            return null;
        });
    }
}
exports.CodeStatsAPI = CodeStatsAPI;
class ApiJSON {
    constructor(date) {
        this.coded_at = utils_1.getISOTimestamp(new Date());
        this.xps = new Array();
    }
}
class ApiXP {
    constructor(language, xp) {
        this.language = language;
        this.xp = xp;
    }
}
//# sourceMappingURL=code-stats-api.js.map