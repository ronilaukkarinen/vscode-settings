import { TextDocument, Range } from 'vscode-languageserver';
import { INode } from '../types/nodes';
import { ISettings } from '../types/settings';
export declare type MakeDocumentOptions = {
    uri?: string;
    languageId?: string;
    version?: number;
};
export declare function makeDocument(lines: string | string[], options?: MakeDocumentOptions): TextDocument;
export declare function makeAst(lines: string[]): INode;
export declare function makeSameLineRange(line?: number, start?: number, end?: number): Range;
export declare function makeSettings(options?: Partial<ISettings>): ISettings;
