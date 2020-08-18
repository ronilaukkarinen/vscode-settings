import * as vscode from 'vscode';
import { CompletionItem } from 'vscode-languageclient';
export declare function testCompletion(docUri: vscode.Uri, position: vscode.Position, expectedItems: (string | CompletionItem)[]): Promise<void>;
