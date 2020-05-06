'use strict';

import * as vscode from 'vscode';
import ScssVariableDefinition from './../../common/scss-variable-definition';

interface ParseVariableEngine {
    languageId: string;
    parse(textDocument:vscode.TextDocument):ScssVariableDefinition[];
}

export default ParseVariableEngine;