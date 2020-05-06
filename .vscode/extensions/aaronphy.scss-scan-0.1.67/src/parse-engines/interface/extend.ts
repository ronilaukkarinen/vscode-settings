'use strict';

import * as vscode from 'vscode';
import ScssExtendDefinition from './../../common/scss-extend-definition';

interface ParseExtendEngine {
    languageId: string;
    parse(textDocument: vscode.TextDocument): ScssExtendDefinition[];
}

export default ParseExtendEngine;