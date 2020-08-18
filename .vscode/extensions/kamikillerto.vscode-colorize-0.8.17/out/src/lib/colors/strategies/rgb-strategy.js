"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_extractor_1 = require("../color-extractor");
const color_1 = require("../color");
const regexp_1 = require("../../util/regexp");
const __strategy_base_1 = require("./__strategy-base");
const R_RED = `(?:\\d{1,3}${regexp_1.DOT_VALUE}?|${regexp_1.DOT_VALUE})`;
const R_GREEN = R_RED;
const R_BLUE = R_RED;
exports.REGEXP = new RegExp(`((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${regexp_1.ALPHA}\\s*\\)))${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`^((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${regexp_1.ALPHA}\\s*\\)))${regexp_1.EOL}`, 'i');
function extractRGBA(value) {
    const rgba_string = value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '');
    return rgba_string.split(/,/gi).map(c => parseFloat(c));
}
function getColor(match) {
    const value = match[1];
    const rgba = extractRGBA(value);
    const alpha = rgba[3] || 1;
    const rgb = rgba.slice(0, 3);
    // Check if it's a valid rgb(a) color
    if (rgb.every(c => c <= 255)) {
        return new color_1.default(match[1], match.index, rgb, alpha);
    }
    return null;
}
const strategy = new __strategy_base_1.default('RGB', exports.REGEXP, exports.REGEXP_ONE, getColor);
color_extractor_1.default.registerStrategy(strategy);
//# sourceMappingURL=rgb-strategy.js.map