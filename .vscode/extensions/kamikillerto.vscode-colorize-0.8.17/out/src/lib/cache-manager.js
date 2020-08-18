"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheManager {
    constructor() {
        this._dirtyCache = new Map();
        this._decorationsCache = new Map();
    }
    /**
     * Return the saved decorations for a document or return null if the file has never been opened before.
     *
     * @param {TextEditor} editor
     * @returns {(Map<number, IDecoration[]> | null)}
     */
    getCachedDecorations(document) {
        if (!document.isDirty && this._decorationsCache.has(document.fileName)) {
            return this._decorationsCache.get(document.fileName);
        }
        if (this._dirtyCache.has(document.fileName)) {
            return this._dirtyCache.get(document.fileName);
        }
        return null;
    }
    /**
     * Save a file decorations
     *
     * @param {TextDocument} document
     * @param {Map<number, IDecoration[]>} deco
     */
    saveDecorations(document, deco) {
        document.isDirty ? this._saveDirtyDecoration(document.fileName, deco) : this._saveSavedDecorations(document.fileName, deco);
    }
    _saveDirtyDecoration(fileName, decorations) {
        return this._dirtyCache.set(fileName, decorations);
    }
    _saveSavedDecorations(fileName, decorations) {
        return this._decorationsCache.set(fileName, decorations);
    }
    clearCache() {
        this._dirtyCache.clear();
        this._decorationsCache.clear();
    }
}
const instance = new CacheManager();
exports.default = instance;
//# sourceMappingURL=cache-manager.js.map