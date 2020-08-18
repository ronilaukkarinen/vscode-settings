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
class ColorStrategy {
    constructor(name, REGEXP, REGEXP_ONE, colorFromRegexp) {
        this.name = name;
        this.REGEXP = REGEXP;
        this.REGEXP_ONE = REGEXP_ONE;
        this.colorFromRegexp = colorFromRegexp;
    }
    extractColors(fileLines) {
        return __awaiter(this, void 0, void 0, function* () {
            return fileLines.map(({ line, text }) => {
                let match = null;
                let colors = [];
                while ((match = this.REGEXP.exec(text)) !== null) {
                    let color = this.colorFromRegexp(match);
                    if (color) {
                        colors.push(color);
                    }
                }
                return {
                    line,
                    colors
                };
            });
        });
    }
    extractColor(text) {
        let match = this.REGEXP_ONE.exec(text);
        if (match) {
            return this.colorFromRegexp(match);
        }
        return null;
    }
}
exports.default = ColorStrategy;
//# sourceMappingURL=__strategy-base.js.map