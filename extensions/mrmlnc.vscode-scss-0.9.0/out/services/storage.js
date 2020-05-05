"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StorageService {
    constructor() {
        this._storage = new Map();
    }
    get(key) {
        return this._storage.get(key);
    }
    set(key, value) {
        this._storage.set(key, value);
    }
    delete(key) {
        this._storage.delete(key);
    }
    clear() {
        this._storage.clear();
    }
    keys() {
        return [...this._storage.keys()];
    }
    values() {
        return [...this._storage.values()];
    }
    entries() {
        return [...this._storage.entries()];
    }
}
exports.default = StorageService;
//# sourceMappingURL=storage.js.map