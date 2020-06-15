"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function isStartingPoint(buffer) {
    return buffer.content !== undefined;
}
function isStopPoint(buffer) {
    return buffer.stop !== undefined;
}
function rehydratePosition(serialized) {
    return new vscode.Position(serialized.line, serialized.character);
}
function rehydrateRange([start, stop]) {
    return new vscode.Range(rehydratePosition(start), rehydratePosition(stop));
}
function rehydrateSelection(serialized) {
    return new vscode.Selection(rehydratePosition(serialized.anchor), rehydratePosition(serialized.active));
}
function rehydrateChangeEvent(serialized) {
    return Object.assign({}, serialized, { range: rehydrateRange(serialized.range) });
}
function rehydrateBuffer(serialized) {
    if (isStopPoint(serialized)) {
        return {
            position: serialized.position,
            stop: {
                name: serialized.stop.name || null
            }
        };
    }
    if (isStartingPoint(serialized)) {
        return {
            position: serialized.position,
            content: serialized.content,
            language: serialized.language,
            selections: serialized.selections.map(rehydrateSelection)
        };
    }
    return {
        position: serialized.position,
        changes: serialized.changes.map(rehydrateChangeEvent),
        selections: serialized.selections.map(rehydrateSelection)
    };
}
exports.rehydrateBuffer = rehydrateBuffer;
//# sourceMappingURL=rehydrate.js.map