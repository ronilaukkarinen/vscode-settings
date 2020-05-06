'use strict';

import * as vscode from 'vscode';
import ScssVariableDefinition from './common/scss-variable-definition';
import VariableParse from './parse-engines/interface/variable';
import VariableParseRegistry from './parse-engines/parse-variable-registry';
class VariableEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<ScssVariableDefinition[]> {
        let textDocument = await vscode.workspace.openTextDocument(uri);
        let parseEngine: VariableParse = VariableParseRegistry.getParseEngine(textDocument.languageId);
        let cssClassDefinitions: ScssVariableDefinition[] = parseEngine.parse(textDocument);
        return cssClassDefinitions;
    }
}

export default VariableEngineGateway;