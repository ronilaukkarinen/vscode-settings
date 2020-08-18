"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_util_1 = require("../util/color-util");
const extractor_mixin_1 = require("../extractor-mixin");
class VariablesExtractor extends extractor_mixin_1.Extractor {
    extractVariables(fileName, fileLines) {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = yield Promise.all(this.enabledStrategies.map(strategy => strategy.extractVariables(fileName, fileLines)));
            return color_util_1.flattenLineExtractionsFlatten(colors); // should regroup per lines?
        });
    }
    deleteVariableInLine(fileName, line) {
        this.enabledStrategies.forEach(strategy => strategy.deleteVariable(fileName, line));
    }
    extractDeclarations(fileName, fileLines) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.enabledStrategies.map(strategy => strategy.extractDeclarations(fileName, fileLines)));
        });
    }
    getVariablesCount() {
        return this.enabledStrategies.reduce((cv, strategy) => cv + strategy.variablesCount(), 0);
    }
    findVariable(variable) {
        return this.get(variable.type).getVariableValue(variable);
    }
    removeVariablesDeclarations(fileName) {
        this.enabledStrategies.forEach(strategy => strategy.deleteVariable(fileName));
    }
}
const instance = new VariablesExtractor();
exports.default = instance;
// WARNINGS/Questions
//  allow space between var name and ':' ?
// css
//
// is --bar--foo valid?
// Less
//
// This is valid
// @fnord:  "I am fnord.";
// @var:    "fnord";
// content: @@var;
// give => content: "I am fnord.";
// ?? reserved css "at-rules" ??
// should be excluded or not ? (less/linter should generate an error)
// @charset
// @import
// @namespace
// @media
// @supports
// @document
// @page
// @font-face
// @keyframes
// @viewport
// @counter-style
// @font-feature-values
// @swash
// @ornaments
// @annotation
// @stylistic
// @styleset
// @character-variant)
// stylus
//
// valid
//
// var= #111;
// --a= #fff
// -a=#fff
// _a= #fff
// $a= #fff
//
// not valid
//
// 1a= #fff
// in sass order matter
//
// ```css
// $t: #fff
// $a: $t
// $t: #ccc
//
// p
//   color: $a
// ```
// here p.color === #fff
// in less order does not matter
//
// ```css
// @t: #fff
// @a: $t
// @t: #ccc
//
// p
//   color: @a
// ```
// here p.color === #ccc
// What about stylus, postcss ???
// should i always use the latest declaration in file?
// vcode-colorize only colorize (does not validate code ¯\_(ツ)_/¯)
//# sourceMappingURL=variables-extractor.js.map