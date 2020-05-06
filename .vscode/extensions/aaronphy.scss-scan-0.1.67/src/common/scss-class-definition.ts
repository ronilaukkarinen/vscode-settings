'use strict';

import * as vscode from 'vscode';

class ScssClassDefinition {
    public constructor(public className: string, public location?: vscode.Location) { }
}

export default ScssClassDefinition;