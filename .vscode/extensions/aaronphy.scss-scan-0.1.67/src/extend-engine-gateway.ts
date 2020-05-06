'use strict';

import * as vscode from 'vscode';
import ScssExtendDefinition from './common/scss-extend-definition';
import ExtendParse from './parse-engines/interface/extend';
import ExtendParseRegistry from './parse-engines/parse-extend-registry';
class ExtendEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<ScssExtendDefinition[]> {
        let textDocument = await vscode.workspace.openTextDocument(uri);
        let parseEngine: ExtendParse = ExtendParseRegistry.getParseEngine(textDocument.languageId);
        let extendDefinitions: ScssExtendDefinition[] = parseEngine.parse(textDocument);
        return extendDefinitions;
    }
}

export default ExtendEngineGateway;