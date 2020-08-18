"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_extractor_1 = require("../color-extractor");
const __strategy_base_1 = require("./__strategy-base");
const regexp_1 = require("../../util/regexp");
const color_1 = require("../color");
const HEXA_PREFIX = '(?:#|0x)';
exports.REGEXP = new RegExp(`(${HEXA_PREFIX}(?:${regexp_1.HEXA_VALUE}{3,4}|${regexp_1.HEXA_VALUE}{6}|${regexp_1.HEXA_VALUE}{8}))${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`^(${HEXA_PREFIX}(?:${regexp_1.HEXA_VALUE}{3,4}|${regexp_1.HEXA_VALUE}{6}|${regexp_1.HEXA_VALUE}{8}))${regexp_1.EOL}`, 'i');
function extractRGB(argb) {
    let rgb = argb.slice(-6);
    if (argb.length === 3 || argb.length === 4) {
        const _argb = argb.slice(-3);
        rgb = [_argb[0], _argb[0], _argb[1], _argb[1], _argb[2], _argb[2]];
    }
    return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
}
function extractAlpha(argb) {
    if (argb.length === 4) {
        let alpha = argb[0];
        return ((16 * alpha) + alpha) / 255;
    }
    if (argb.length === 8) {
        let alpha = argb.slice(0, 2);
        return ((16 * alpha[0]) + alpha[1]) / 255;
    }
    return 1;
}
function removePrefix(argb) {
    return /(?:#|0x)(.+)/gi.exec(argb);
}
function hexaToInt(argb) {
    return argb.split('').map(_ => parseInt(_, 16));
}
function getColor(match) {
    const value = match[1];
    const argb = removePrefix(value)[1];
    const values = hexaToInt(argb);
    const rgb = extractRGB(values);
    const alpha = extractAlpha(values);
    return new color_1.default(value, match.index, rgb, alpha);
}
const strategy = new __strategy_base_1.default('ARGB', exports.REGEXP, exports.REGEXP_ONE, getColor);
color_extractor_1.default.registerStrategy(strategy);
exports.default = strategy;
//# sourceMappingURL=argb-strategy.js.map