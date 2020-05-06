'use strict';

import * as vscode from 'vscode';
import ScssClassDefinition from './common/scss-class-definition';
import ClassParse from './parse-engines/interface/class';
import ParseEngineRegistry from './parse-engines/parse-engine-registry';
class ParseEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<ScssClassDefinition[]> {
        let textDocument = await vscode.workspace.openTextDocument(uri);
        let parseEngine: ClassParse = ParseEngineRegistry.getParseEngine(textDocument.languageId);
        let cssClassDefinitions: ScssClassDefinition[] = parseEngine.parse(textDocument);
        return cssClassDefinitions;
    }
}

export default ParseEngineGateway;