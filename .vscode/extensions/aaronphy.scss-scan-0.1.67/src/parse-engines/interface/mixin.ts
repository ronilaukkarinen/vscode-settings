'use strict';

import * as vscode from 'vscode';
import ScssMixinDefinition from './../../common/scss-mixin-definition';

interface ParseMixinEngine {
    languageId: string;
    parse(textDocument: vscode.TextDocument): ScssMixinDefinition[];
}

export default ParseMixinEngine;