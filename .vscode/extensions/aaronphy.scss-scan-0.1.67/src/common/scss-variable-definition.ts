'use strict';

import * as vscode from 'vscode';

class ScssVarDefinition {
    public constructor(public prop: string, public val:string, public location?: vscode.Location) { }
}

export default ScssVarDefinition;