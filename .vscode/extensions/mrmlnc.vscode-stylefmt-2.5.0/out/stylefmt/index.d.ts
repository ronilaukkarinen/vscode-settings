import * as vscode from 'vscode';
import * as Types from '../types';
export declare function use(settings: Types.ISettings, document: vscode.TextDocument, range: vscode.Range): Promise<Types.IResult>;
