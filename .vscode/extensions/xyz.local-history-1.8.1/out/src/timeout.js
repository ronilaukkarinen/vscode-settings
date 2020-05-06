"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timeout {
    constructor(duration) {
        this.duration = 0;
        this.duration = duration;
        this.startTime = new Date();
    }
    isTimedOut() {
        return this.getDuration() > this.duration;
    }
    logDuration(message = '') {
        console.log(`${message}: ${this.getDuration()}`);
    }
    getDuration() {
        return (new Date()).getTime() - this.startTime.getTime();
    }
}
exports.default = Timeout;
//# sourceMappingURL=timeout.js.map