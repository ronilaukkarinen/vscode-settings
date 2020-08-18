"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_extractor_1 = require("../variables-extractor");
const regexp_1 = require("../../util/regexp");
const __strategy_base_1 = require("./__strategy-base");
exports.REGEXP = new RegExp(`(var\\((--(?:[a-z]+[\-_a-z\\d]*))\\))(?!:)${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`^(var\\((--(?:[a-z]+[\-_a-z\\d]*))\\))(?!:)${regexp_1.EOL}`, 'i');
exports.DECLARATION_REGEXP = new RegExp(`(?:(--(?:[a-z]+[\\-_a-z\\d]*)\\s*):)${regexp_1.EOL}`, 'gi');
const RegexpExtractor = {
    getVariableNameFromDeclaration(match) {
        return (match[1] || match[2]).trim();
    },
    getVariableNameFromUses(match) {
        return [match[2].trim(), match[1].trim()];
    },
    getVariableNameFromUse(match) {
        return match[2].trim();
    }
};
const CssExtractor = new __strategy_base_1.default('CSS', exports.DECLARATION_REGEXP, exports.REGEXP, exports.REGEXP_ONE, RegexpExtractor);
variables_extractor_1.default.registerStrategy(CssExtractor);
exports.default = CssExtractor;
// ------------------------------------------------------------
// ------------------------------------------------------------
//
// THIS IS VALID
// --val: 20%, 10%, 1
// hsl(var(--val))
// hsla(var(--val), .3)
// TODO
//# sourceMappingURL=css-strategy.js.map