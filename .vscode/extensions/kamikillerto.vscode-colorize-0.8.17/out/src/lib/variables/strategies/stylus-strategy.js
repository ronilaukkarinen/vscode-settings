"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_extractor_1 = require("../variables-extractor");
const regexp_1 = require("../../util/regexp");
const __strategy_base_1 = require("./__strategy-base");
exports.REGEXP = new RegExp(`(^|(?::|=)\\s*)((?:[\\-]*[$a-z_][\\-_\\d]*)+)(?!=)${regexp_1.EOL}`, 'gi');
exports.REGEXP_ONE = new RegExp(`(^|(?::|=)\\s*)((?:[\\-]*[$a-z_][\\-_\\d]*)+)(?!=)${regexp_1.EOL}`, 'i');
exports.DECLARATION_REGEXP = new RegExp(`(?:(^(?:\\$|(?:[\\-_$]+[a-z\\d]+)|(?:[^\\d||\\-|@]+))(?:[_a-z\\d][\\-]*)*))\\s*=${regexp_1.EOL}`, 'gi');
const RegexpExtractor = {
    getVariableNameFromDeclaration(match) {
        return (match[1] || match[2]).trim();
    },
    getVariableNameFromUses(match) {
        return [match[2].trim(), null, match[1]];
    },
    getVariableNameFromUse(match) {
        return match[2].trim();
    }
};
variables_extractor_1.default.registerStrategy(new __strategy_base_1.default('STYLUS', exports.DECLARATION_REGEXP, exports.REGEXP, exports.REGEXP_ONE, RegexpExtractor));
//# sourceMappingURL=stylus-strategy.js.map