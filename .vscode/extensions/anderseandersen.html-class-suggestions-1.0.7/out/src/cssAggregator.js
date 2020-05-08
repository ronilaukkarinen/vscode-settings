"use strict";
var vscode_1 = require('vscode');
var css_1 = require('css');
var fs_1 = require('fs');
var arrayUtils_1 = require('./arrayUtils');
var cssUtils_1 = require('./cssUtils');
var XXH = require('xxhashjs').h32;
function default_1() {
    var startTime = process.hrtime();
    var cssHashSet = new Set();
    return vscode_1.workspace.findFiles('**/*.css', '').then(function (uris) {
        var cssTextPromises = uris.map(function (uri) {
            return new Promise(function (resolve, reject) {
                return fs_1.readFile(uri.fsPath, vscode_1.workspace.getConfiguration('files').get('encoding'), function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.toString());
                    }
                });
            });
        });
        var uniqueCssTextsPromise = Promise.all(cssTextPromises).then(function (cssTexts) { return cssTexts.filter(function (cssText) {
            var hash = XXH(cssText, 0x1337).toNumber();
            if (cssHashSet.has(hash)) {
                return false;
            }
            else {
                cssHashSet.add(hash);
                return true;
            }
        }); });
        var cssASTsPromise = uniqueCssTextsPromise.then(function (uniqueCssTexts) { return uniqueCssTexts.map(function (cssText) {
            try {
                return css_1.parse(cssText);
            }
            catch (Error) {
                return undefined;
            }
        }).filter(function (cssAST) { return cssAST !== undefined; }); }, console.log);
        var rulesPromise = cssASTsPromise.then(function (cssASTs) {
            if (cssASTs.length > 0) {
                return arrayUtils_1.flatten(cssASTs.map(function (cssAST) {
                    var rootRules = cssUtils_1.findRootRules(cssAST);
                    var mediaRules = cssUtils_1.findMediaRules(cssAST);
                    return rootRules.concat(mediaRules);
                }));
            }
            else {
                return [];
            }
        }, console.log);
        var selectorsPromise = rulesPromise.then(function (rules) {
            if (rules.length > 0) {
                return arrayUtils_1.flatten(rules.map(function (rule) { return rule.selectors; })).filter(function (value) { return value && value.length > 0; });
            }
            else {
                return [];
            }
        }, console.log);
        var cssClassesPromise = selectorsPromise.then(function (selectors) {
            return selectors
                .map(function (selector) { return cssUtils_1.findClassName(selector); })
                .filter(function (value) { return value && value.length > 0; })
                .map(function (className) { return cssUtils_1.sanitizeClassName(className); });
        }, console.log);
        return cssClassesPromise.then(function (cssClasses) {
            var uniqueCssClasses = Array.from(new Set(cssClasses));
            var elapsedTime = process.hrtime(startTime);
            console.log("Elapsed time: " + elapsedTime[0] + " s " + Math.trunc(elapsedTime[1] / 1e6) + " ms");
            console.log("Files processed: " + cssHashSet.size);
            console.log("cssClasses discovered: " + uniqueCssClasses.length);
            vscode_1.window.setStatusBarMessage("HTML Class Suggestions processed " + cssHashSet.size + " distinct css files and discovered " + uniqueCssClasses.length + " css classes.", 10000);
            return uniqueCssClasses;
        }, console.log);
    }, console.log);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=cssAggregator.js.map