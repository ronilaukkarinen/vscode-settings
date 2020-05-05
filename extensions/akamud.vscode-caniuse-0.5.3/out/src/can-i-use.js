var request = require('request');
var CanIUse = (function () {
    function CanIUse() {
        this.rulesDictionary = require("../../data/rulesDictionary.json");
        this.wellSupportedProperties = require("../../data/wellSupportedProperties.json");
        this.selectedBrowsers = ['IE', 'Firefox', 'Chrome', 'Safari', 'Opera'];
    }
    CanIUse.prototype.isWellSupported = function (word) {
        return this.wellSupportedProperties["well-supported-properties"].indexOf(word) >= 0;
    };
    CanIUse.prototype.getNormalizedRule = function (word) {
        var dict = this.rulesDictionary;
        var normalizedRule;
        for (var p in dict) {
            if (word.toLowerCase() == p.toLowerCase()) {
                normalizedRule = dict[p];
                break;
            }
        }
        return normalizedRule || word;
    };
    CanIUse.prototype.retrieveInformation = function (word, callback) {
        var caniuse = this;
        if (caniuse.isWellSupported(word)) {
            callback("Can I Use: All browsers ✔ (CSS 2.1 properties, well-supported subset)");
        }
        else {
            request.get({
                json: true,
                uri: 'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json',
                gzip: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var rule = body.data[word];
                    if (rule) {
                        callback(caniuse.getSupportStatus(rule));
                        return;
                    }
                }
                callback("Can I Use: entry not found");
            });
        }
    };
    CanIUse.prototype.getSupportStatus = function (data) {
        var stats = data.stats;
        var result = [];
        for (var i = 0; i < this.selectedBrowsers.length; i++) {
            var browser = stats[this.selectedBrowsers[i].toLowerCase()];
            var version = this.getVersion(browser);
            if (version) {
                result.push(this.selectedBrowsers[i] + " ✔ " + version);
            }
            else {
                result.push(this.selectedBrowsers[i] + " ✘");
            }
        }
        var message;
        if (result && result.length > 0) {
            message = "Can I Use: " + result.join(" ");
        }
        return message;
    };
    CanIUse.prototype.getVersion = function (stats) {
        var keys = Object.keys(stats).sort(function (a, b) {
            var aNumber = +a;
            var bNumber = +b;
            return aNumber > bNumber ? 1 : aNumber == bNumber ? 0 : -1;
        });
        var found;
        for (var i = 0; i < keys.length; i++) {
            var element = keys[i];
            if (stats[keys[i]].indexOf("a") >= 0 || stats[keys[i]].indexOf("y") >= 0) {
                found = keys[i];
                break;
            }
        }
        return found && found + "+";
    };
    return CanIUse;
})();
exports.CanIUse = CanIUse;
//# sourceMappingURL=can-i-use.js.map