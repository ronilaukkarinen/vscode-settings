"use strict";
var arrayUtils_1 = require('./arrayUtils');
function findRootRules(cssAST) {
    return cssAST.stylesheet.rules.filter(function (node) { return node.type === 'rule'; });
}
exports.findRootRules = findRootRules;
function findMediaRules(cssAST) {
    var mediaNodes = (cssAST.stylesheet.rules.filter(function (node) {
        return node.type === 'media';
    }));
    if (mediaNodes.length > 0) {
        return arrayUtils_1.flatten(mediaNodes.map(function (node) { return node.rules; }));
    }
    else {
        return [];
    }
}
exports.findMediaRules = findMediaRules;
function findClassName(selector) {
    var classNameStartIndex = selector.lastIndexOf('.');
    if (classNameStartIndex >= 0) {
        var classText = selector.substr(classNameStartIndex + 1);
        // Search for one of ' ', '[', ':' or '>', that isn't escaped with a backslash
        var classNameEndIndex = classText.search(/[^\\][\s\[:>]/);
        if (classNameEndIndex >= 0) {
            return classText.substr(0, classNameEndIndex + 1);
        }
        else {
            return classText;
        }
    }
    else {
        return "";
    }
}
exports.findClassName = findClassName;
function sanitizeClassName(className) {
    return className.replace(/\\[!"#$%&'()*+,\-./:;<=>?@[\\\]^`{|}~]/g, function (substr) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 2) {
            return substr.slice(1);
        }
        else {
            return substr;
        }
    });
}
exports.sanitizeClassName = sanitizeClassName;
//# sourceMappingURL=cssUtils.js.map