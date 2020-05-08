import { DocumentContext } from 'vscode-css-languageservice';
/**
 * Returns the path to the document, relative to the current document.
 */
export declare function getDocumentPath(currentPath: string, symbolsPath: string): string;
/**
 * Primary copied from the original VSCode CSS extension:
 * https://github.com/microsoft/vscode/blob/2bb6cfc16a88281b75cfdaced340308ff89a849e/extensions/css-language-features/server/src/utils/documentContext.ts
 */
export declare function buildDocumentContext(base: string): DocumentContext;
export declare function getModuleNameFromPath(filepath: string): string;
export declare function resolvePathToModule(moduleName: string, relativeTo: string): string | undefined;
