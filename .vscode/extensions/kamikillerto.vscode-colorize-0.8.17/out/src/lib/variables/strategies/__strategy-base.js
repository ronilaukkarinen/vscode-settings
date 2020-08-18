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
const variable_1 = require("../variable");
const color_1 = require("../../colors/color");
const variable_store_1 = require("../variable-store");
const color_extractor_1 = require("../../colors/color-extractor");
const color_util_1 = require("../../util/color-util");
class VariableStrategy {
    constructor(name, DECLARATION_REGEXP, USES_REGEXP, USE_REGEXP, regexpExtractor) {
        this.name = name;
        this.DECLARATION_REGEXP = DECLARATION_REGEXP;
        this.USES_REGEXP = USES_REGEXP;
        this.USE_REGEXP = USE_REGEXP;
        this.regexpExtractor = regexpExtractor;
        this.store = new variable_store_1.default();
    }
    extractDeclarations(fileName, fileLines) {
        return __awaiter(this, void 0, void 0, function* () {
            return fileLines.map(({ text, line }) => this.__extractDeclarations(fileName, text, line)).length;
        });
    }
    __extractDeclarations(fileName, text, line) {
        let match = null;
        while ((match = this.DECLARATION_REGEXP.exec(text)) !== null) {
            const varName = this.regexpExtractor.getVariableNameFromDeclaration(match);
            let color = color_extractor_1.default.extractOneColor(text.slice(match.index + match[0].length).trim()) || this.extractVariable(fileName, text.slice(match.index + match[0].length).trim());
            if (this.store.has(varName, fileName, line)) {
                const decoration = this.store.findDeclaration(varName, fileName, line);
                decoration.update(color);
            }
            else {
                const variable = new variable_1.default(varName, color, { fileName, line, position: match.index }, this.name);
                this.store.addEntry(varName, variable); // update entry?? // outside ?
            }
        }
    }
    extractVariables(fileName, fileLines) {
        const variables = fileLines.map(({ line, text }) => {
            let match = null;
            let colors = [];
            while ((match = this.USES_REGEXP.exec(text)) !== null) {
                let [varName, extendedVarName, spaces] = this.regexpExtractor.getVariableNameFromUses(match);
                const spacesCount = (spaces || '').length;
                const location = { fileName, line, position: spacesCount + match.index };
                let variable = new variable_1.default(varName, new color_1.default(extendedVarName || varName, spacesCount + match.index, null, null), location, this.name);
                colors.push(variable);
            }
            return { line, colors };
        });
        return color_util_1.flattenLineExtractionsFlatten(variables);
    }
    extractVariable(fileName, text) {
        let match = text.match(this.USE_REGEXP);
        let variable;
        if (match) {
            const varName = this.regexpExtractor.getVariableNameFromUse(match);
            variable = this.store.findClosestDeclaration(varName, fileName);
            // variable = this.store.findClosestDeclaration(match[2], fileName);
            return variable ? variable.color : undefined;
        }
    }
    /**
     * Return the value (color) of a variable.
     * The value is determined by searching the nearest variable declaration
     * @param {Variable} variable
     * @returns {Color|null}
     */
    getVariableValue(variable) {
        let color = null;
        if (this.store.has(variable.name) === true) {
            let declaration = this.store.findClosestDeclaration(variable.name, variable.location.fileName);
            if (declaration.color === undefined) {
                declaration = this.store.findClosestDeclaration(variable.name, '.');
            }
            if (declaration.color) {
                color = new color_1.default(variable.color.value, variable.location.position, declaration.color.rgb, declaration.color.alpha);
            }
        }
        return color;
    }
    variablesCount() {
        return this.store.count;
    }
    deleteVariable(fileName, line) {
        return this.store.delete(null, fileName, line);
    }
}
exports.default = VariableStrategy;
// Use mixin instead?
// type Constructor<T = {}> = new (...args: any[]) => T;
// export function TExtractor<TBase extends Constructor>(Base: TBase) {
//   return class TExtractor extends Base {
//   };
// }
//# sourceMappingURL=__strategy-base.js.map