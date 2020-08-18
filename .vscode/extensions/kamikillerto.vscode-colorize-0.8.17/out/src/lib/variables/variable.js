"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Variable {
    constructor(name, color, location, type) {
        this.name = name;
        this.color = color;
        this.location = location;
        this.type = type;
    }
    /**
     * Generate the color string rgb representation
     * example :
     *  #fff => rgb(255, 255, 255)
     *  rgba(1, 34, 12, .1) => rgb(1, 34, 12)
     *
     * @returns {string}
     * @public
     * @memberOf Color
     */
    toRgbString() {
        return this.color.toRgbString();
    }
    update(color) {
        this.color = color;
    }
}
exports.default = Variable;
//# sourceMappingURL=variable.js.map