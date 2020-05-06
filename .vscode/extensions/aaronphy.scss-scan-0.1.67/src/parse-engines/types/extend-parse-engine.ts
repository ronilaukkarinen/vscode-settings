import * as gonzales from 'gonzales-pe';
import * as vscode from 'vscode';
import ScssExtendDefinition from '../../common/scss-extend-definition';
import ParseExtendEngine from '../interface/extend';
import Ruleset from '../typehandler/ruleset';

class ExtendParseEngine implements ParseExtendEngine {
    public languageId: string = 'scss';

    public parse(textDocument:vscode.TextDocument):ScssExtendDefinition[]{
        let definitions:ScssExtendDefinition[] =[];
        let code: string = textDocument.getText();
        let parseTree:any = gonzales.parse(code,{syntax:'scss'});
        parseTree.content.map((item:any)=>{
            if(item.type == 'ruleset'){
                definitions.push(Ruleset(item));
            }
        });
        return definitions;
    }
}

export default ExtendParseEngine;