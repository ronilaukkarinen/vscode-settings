"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_extractor_1 = require("../variables-extractor");
const regexp_1 = require("../../util/regexp");
const __strategy_base_1 = require("./__strategy-base");
exports.REGEXP = new RegExp(`(@(?:[a-z]+[\\-_a-z\\d]*)(?!:))${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`^(@(?:[a-z]+[\\-_a-z\\d]*)(?!:))${regexp_1.EOL}`, 'i');
exports.DECLARATION_REGEXP = new RegExp(`(?:(@(?:[a-z]+[\\-_a-z\\d]*)\\s*):)${regexp_1.EOL}`, 'gi');
const RegexpExtractor = {
    getVariableNameFromDeclaration(match) {
        return (match[1] || match[2]).trim();
    },
    getVariableNameFromUses(match) {
        return [match[1].trim()];
    },
    getVariableNameFromUse(match) {
        return match[1].trim();
    }
};
variables_extractor_1.default.registerStrategy(new __strategy_base_1.default('LESS', exports.DECLARATION_REGEXP, exports.REGEXP, exports.REGEXP_ONE, RegexpExtractor));
//# sourceMappingURL=less-strategy.js.map