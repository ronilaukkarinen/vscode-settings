"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./../color");
const color_extractor_1 = require("../color-extractor");
const color_util_1 = require("../../util/color-util");
const regexp_1 = require("../../util/regexp");
const __strategy_base_1 = require("./__strategy-base");
const R_HUE = `\\d*${regexp_1.DOT_VALUE}?`;
const R_SATURATION = `(?:\\d{1,3}${regexp_1.DOT_VALUE}?|${regexp_1.DOT_VALUE})%`;
const R_LUMINANCE = R_SATURATION;
exports.REGEXP = new RegExp(`((?:hsl\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}\\s*,\\s*${R_LUMINANCE}\\s*\\))|(?:hsla\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}\\s*,\\s*${R_LUMINANCE}\\s*,\\s*${regexp_1.ALPHA}\\s*\\)))${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`^((?:hsl\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}\\s*,\\s*${R_LUMINANCE}\\s*\\))|(?:hsla\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}\\s*,\\s*${R_LUMINANCE}\\s*,\\s*${regexp_1.ALPHA}\\s*\\)))${regexp_1.EOL}`, 'i');
// export const REGEXP_ONE = /^((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;
/**
 * @private
 * @param {any} value An hsl(a) color string (`hsl(10, 1%, 1%)`)
 * @returns {number[]} The colors h,s,l,a values
 *
 * @memberof HSLColorExtractor
 */
function extractHSLValue(value) {
    const [h, s, l, a] = value.replace(/hsl(a){0,1}\(/, '').replace(/\)/, '').replace(/%/g, '').split(/,/gi).map(c => parseFloat(c));
    return [h, s, l, a];
}
function getColor(match) {
    const value = match[0];
    const [h, s, l, a] = extractHSLValue(value);
    if (s <= 100 && l <= 100) {
        let [r, g, b] = color_util_1.convertHslaToRgba(h, s, l, a);
        return new color_1.default(match[1], match.index, [r, g, b]);
    }
    return null;
}
const strategy = new __strategy_base_1.default('HSL', exports.REGEXP, exports.REGEXP_ONE, getColor);
color_extractor_1.default.registerStrategy(strategy);
exports.default = strategy;
//# sourceMappingURL=hsl-strategy.js.map