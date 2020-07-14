"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const NodeCache = require("node-cache");
class CacheManager {
    constructor() {
        // default cache of 2 minutes
        this.myCache = new NodeCache({ stdTTL: 120 });
    }
    static getInstance() {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }
    get(key) {
        return this.myCache.get(key);
    }
    set(key, value, ttl = -1) {
        if (ttl > 0) {
            this.myCache.set(key, value, ttl);
        }
        else {
            // use the standard cache ttl
            this.myCache.set(key, value);
        }
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=CacheManager.js.map