"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOL = `(?:$|\`|"|'|,| |;|\\)|\\r|\\n|\}|<)`;
exports.EOL = EOL;
const DOT_VALUE = `(?:\\.\\d+)`; // ['.x', '']
exports.DOT_VALUE = DOT_VALUE;
const ALPHA = `(?:1(:?\\.0+)?|0${DOT_VALUE}?|${DOT_VALUE})`; // ['0', '1', '0.x', '1.0', '.x']
exports.ALPHA = ALPHA;
const HEXA_VALUE = '[\\da-f]'; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
exports.HEXA_VALUE = HEXA_VALUE;
//# sourceMappingURL=regexp.js.map