import * as gonzales from 'gonzales-pe';
import * as vscode from 'vscode';
import ScssVariableDefinition from '../../common/scss-variable-definition';
import ParseVariableEngine from '../interface/variable';
import Declaration from '../typehandler/declaration';

class VariableParseEngine implements ParseVariableEngine {
    public languageId: string = 'scss';

    public parse(textDocument:vscode.TextDocument):ScssVariableDefinition[]{
        let definitions:ScssVariableDefinition[] =[];
        let code: string = textDocument.getText();
        let parseTree = gonzales.parse(code,{syntax:'scss'});
        parseTree.content.map((item:any)=>{
            if(item.type == 'declaration'){
                definitions.push(Declaration(item));
            }
        });
        return definitions;
    }
}

export default VariableParseEngine;