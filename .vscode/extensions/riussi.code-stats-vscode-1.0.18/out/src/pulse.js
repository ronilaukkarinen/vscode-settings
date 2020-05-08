"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pulse {
    constructor() {
        this.xps = new Map();
    }
    getXP(language) {
        let xp = this.xps.get(language);
        if (xp === null || xp === undefined) {
            return 0;
        }
        else {
            return xp;
        }
    }
    addXP(language, amount) {
        let xp = this.getXP(language);
        xp += amount;
        this.xps.set(language, xp);
    }
    get getXPs() {
        return this.xps;
    }
    reset() {
        this.xps = new Map();
    }
}
exports.Pulse = Pulse;
//# sourceMappingURL=pulse.js.map