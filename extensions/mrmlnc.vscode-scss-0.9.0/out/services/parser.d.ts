import { TextDocument } from 'vscode-languageserver';
import { DocumentLink } from 'vscode-css-languageservice';
import { IDocument, IImport } from '../types/symbols';
/**
 * Returns all Symbols in a single document.
 */
export declare function parseDocument(document: TextDocument, offset?: number): Promise<IDocument>;
export declare function convertLinksToImports(links: DocumentLink[]): IImport[];
