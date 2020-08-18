import { TextDocument, Position } from 'vscode-languageserver';
declare type Region = [number, number];
export declare function isVueFile(path: string): boolean;
export declare function getVueSCSSRegions(content: string): Region[];
export declare function getVueSCSSContent(content: string, regions?: Region[]): string;
export declare function getSCSSRegionsDocument(document: TextDocument, position: Position): {
    document: TextDocument;
    offset: number;
};
export {};
