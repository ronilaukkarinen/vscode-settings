import * as vscode from 'vscode';
export declare function testHover(docUri: vscode.Uri, position: vscode.Position, expectedHover: vscode.Hover): Promise<void>;
