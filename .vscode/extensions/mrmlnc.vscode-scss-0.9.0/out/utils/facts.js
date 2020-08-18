'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorProposals = [
    'red',
    'green',
    'blue',
    'mix',
    'hue',
    'saturation',
    'lightness',
    'adjust-hue',
    'lighten',
    'darken',
    'saturate',
    'desaturate',
    'grayscale',
    'complement',
    'invert',
    'alpha',
    'opacity',
    'rgba',
    'opacify',
    'fade-in',
    'transparentize',
    'adjust-color',
    'scale-color',
    'change-color',
    'ie-hex-str'
];
exports.selectorFunctions = [
    'selector-nest',
    'selector-append',
    'selector-extend',
    'selector-replace',
    'selector-unify',
    'is-superselector',
    'simple-selectors',
    'selector-parse'
];
exports.builtInFunctions = [
    'unquote',
    'quote',
    'str-length',
    'str-insert',
    'str-index',
    'str-slice',
    'to-upper-case',
    'to-lower-case',
    'percentage',
    'round',
    'ceil',
    'floor',
    'abs',
    'min',
    'max',
    'random',
    'length',
    'nth',
    'set-nth',
    'join',
    'append',
    'zip',
    'index',
    'list-separator',
    'map-get',
    'map-merge',
    'map-remove',
    'map-keys',
    'map-values',
    'map-has-key',
    'keywords',
    'feature-exists',
    'variable-exists',
    'global-variable-exists',
    'function-exists',
    'mixin-exists',
    'inspect',
    'type-of',
    'unit',
    'unitless',
    'comparable',
    'call'
];
function hasInFacts(word) {
    return (exports.colorProposals.indexOf(word) !== -1 ||
        exports.selectorFunctions.indexOf(word) !== -1 ||
        exports.builtInFunctions.indexOf(word) !== -1);
}
exports.hasInFacts = hasInFacts;
//# sourceMappingURL=facts.js.map