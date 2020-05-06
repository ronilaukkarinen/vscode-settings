'use strict';

import * as vscode from 'vscode';

class ScssMixinDefinition {
    public constructor(public prop: string,public val:string, public location?: vscode.Location) { }
}

export default ScssMixinDefinition;