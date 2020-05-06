'use strict';

import * as vscode from 'vscode';
import ScssMixinDefinition from './common/scss-mixin-definition';
import MixinParse from './parse-engines/interface/mixin';
import MixinParseRegistry from './parse-engines/parse-mixin-registry';
class MixinEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<ScssMixinDefinition[]> {
        let textDocument = await vscode.workspace.openTextDocument(uri);
        let parseEngine: MixinParse = MixinParseRegistry.getParseEngine(textDocument.languageId);
        let mixinDefinitions: ScssMixinDefinition[] = parseEngine.parse(textDocument);
        return mixinDefinitions;
    }
}

export default MixinEngineGateway;