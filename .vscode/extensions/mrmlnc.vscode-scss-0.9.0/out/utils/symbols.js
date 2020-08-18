'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns Symbols from all documents.
 */
function getSymbolsCollection(storage) {
    return storage.values();
}
exports.getSymbolsCollection = getSymbolsCollection;
function getSymbolsRelatedToDocument(storage, current) {
    return getSymbolsCollection(storage).filter(item => item.document !== current || item.filepath !== current);
}
exports.getSymbolsRelatedToDocument = getSymbolsRelatedToDocument;
//# sourceMappingURL=symbols.js.map