"use strict";
function flatten(nestedArray) {
    if (nestedArray.length === 0) {
        throw new RangeError("Can't flatten an empty array.");
    }
    else {
        return nestedArray.reduce(function (a, b) { return a.concat(b); });
    }
}
exports.flatten = flatten;
//# sourceMappingURL=arrayUtils.js.map