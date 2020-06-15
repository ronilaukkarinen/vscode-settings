"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let buffers = [];
function isStartingPoint(buffer) {
    return (buffer.content !== undefined &&
        buffer.content !== null);
}
exports.isStartingPoint = isStartingPoint;
function isStopPoint(buffer) {
    return (buffer.stop !== undefined && buffer.stop !== null);
}
exports.isStopPoint = isStopPoint;
function all() {
    return buffers;
}
exports.all = all;
function get(position) {
    return buffers[position];
}
exports.get = get;
// @TODO LOL delete this shit
function inject(_buffers) {
    buffers = _buffers;
}
exports.inject = inject;
function insert(buffer) {
    buffers.push(buffer);
}
exports.insert = insert;
function clear() {
    buffers = [];
}
exports.clear = clear;
function count() {
    return buffers.length;
}
exports.count = count;
//# sourceMappingURL=buffers.js.map