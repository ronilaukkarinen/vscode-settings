'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns word by specified position.
 */
function getCurrentWord(text, offset) {
    let i = offset - 1;
    while (i >= 0 && !' \t\n\r":[()]}/,'.includes(text.charAt(i))) {
        i--;
    }
    return text.substring(i + 1, offset);
}
exports.getCurrentWord = getCurrentWord;
/**
 * Returns text before specified position.
 */
function getTextBeforePosition(text, offset) {
    let i = offset - 1;
    while (!'\n\r'.includes(text.charAt(i))) {
        i--;
    }
    return text.substring(i + 1, offset);
}
exports.getTextBeforePosition = getTextBeforePosition;
/**
 * Returns text after specified position.
 */
function getTextAfterPosition(text, offset) {
    let i = offset + 1;
    while (!'\n\r'.includes(text.charAt(i))) {
        i++;
    }
    return text.substring(i + 1, offset);
}
exports.getTextAfterPosition = getTextAfterPosition;
/**
 * Limit of string length.
 */
function getLimitedString(str, ellipsis = true) {
    if (!str) {
        return 'null';
    }
    // Twitter <3
    if (str.length < 140) {
        return str;
    }
    return str.slice(0, 140) + (ellipsis ? '\u2026' : '');
}
exports.getLimitedString = getLimitedString;
//# sourceMappingURL=string.js.map