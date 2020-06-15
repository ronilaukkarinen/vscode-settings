"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cache = require("vscode-cache");
const rehydrate_1 = require("./rehydrate");
const LISTINGS = "HackerTyper:Listings";
const MACROS = "HackerTyper:Macros";
/*
  Stores macros in a persistent caches, where
  - Metadata is stored in a storage namespace ${LISTINGS}
  - Individual buffers are stored in in namespace ${MACROS}
*/
class Storage {
    static getInstance(context) {
        if (Storage._instance) {
            return Storage._instance;
        }
        return (Storage._instance = new Storage(context));
    }
    constructor(context) {
        this._listings = new Cache(context, LISTINGS);
        this._macros = new Cache(context, MACROS);
    }
    /**
     * List all metadata items
     */
    list() {
        const listings = this._listings.all();
        return Object.keys(listings).map(key => listings[key]);
    }
    /**
     * Get full macro metadata and buffers by name
     * @param name Get
     */
    getByName(name) {
        const listing = this._listings.get(name);
        const buffers = this._macros.get(name);
        return Object.assign({}, listing, { buffers: buffers.map(rehydrate_1.rehydrateBuffer) });
    }
    /**
     * Saves the given macro
     * @param macro Macro metadata and buffers to store
     */
    save(macro) {
        const { buffers } = macro, metadata = __rest(macro, ["buffers"]);
        const operations = [
            this._listings.put(macro.name, metadata),
            // Run JSON serialization on buffers to convert them from
            // VSCode classes to plain JavaScript objects.
            this._macros.put(macro.name, JSON.parse(JSON.stringify(buffers)))
        ];
        return Promise.all(operations).then(() => {
            return macro;
        });
    }
    remove(name) {
        this._listings.forget(name);
        this._macros.forget(name);
    }
}
exports.default = Storage;
//# sourceMappingURL=storage.js.map