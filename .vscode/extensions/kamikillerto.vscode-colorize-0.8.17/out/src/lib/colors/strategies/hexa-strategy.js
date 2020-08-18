"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_extractor_1 = require("../color-extractor");
const __strategy_base_1 = require("./__strategy-base");
const regexp_1 = require("../../util/regexp");
const color_1 = require("../color");
const HEXA_PREFIX = '(?:#|0x)';
exports.REGEXP = new RegExp(`(${HEXA_PREFIX}(?:${regexp_1.HEXA_VALUE}{3,4}|${regexp_1.HEXA_VALUE}{6}|${regexp_1.HEXA_VALUE}{8}))${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`^(${HEXA_PREFIX}(?:${regexp_1.HEXA_VALUE}{3,4}|${regexp_1.HEXA_VALUE}{6}|${regexp_1.HEXA_VALUE}{8}))${regexp_1.EOL}`, 'i');
function extractRGB(values) {
    let rgb = values.slice(0, 6);
    if (values.length === 3 || values.length === 4) {
        const _rgb = values.slice(0, 3);
        rgb = [_rgb[0], _rgb[0], _rgb[1], _rgb[1], _rgb[2], _rgb[2]];
    }
    return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
}
function extractAlpha(values) {
    if (values.length === 4) {
        let alpha = values[3];
        return ((16 * alpha) + alpha) / 255;
    }
    if (values.length === 8) {
        let alpha = values.slice(6, 8);
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
    const str = removePrefix(value)[1];
    const values = hexaToInt(str);
    const rgb = extractRGB(values);
    const alpha = extractAlpha(values);
    return new color_1.default(value, match.index, rgb, alpha);
}
const strategy = new __strategy_base_1.default('HEXA', exports.REGEXP, exports.REGEXP_ONE, getColor);
color_extractor_1.default.registerStrategy(strategy);
exports.default = strategy;
//# sourceMappingURL=hexa-strategy.js.map