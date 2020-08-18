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
class ColorExtractor extends extractor_mixin_1.Extractor {
    extract(fileLines) {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = yield Promise.all(this.enabledStrategies.map(strategy => strategy.extractColors(fileLines)));
            return color_util_1.flattenLineExtractionsFlatten(colors); // should regroup per lines?
        });
    }
    extractOneColor(text) {
        let colors = this.enabledStrategies.map(strategy => strategy.extractColor(text));
        return colors.find(color => color !== null);
    }
}
const instance = new ColorExtractor();
exports.default = instance;
//# sourceMappingURL=color-extractor.js.map