'use strict';

import * as vscode from 'vscode';
import ScssClassDefinition from './../../common/scss-class-definition';

interface ParseClassEngine {
    languageId: string;
    parse(textDocument: vscode.TextDocument): ScssClassDefinition[];
}

export default ParseClassEngine;