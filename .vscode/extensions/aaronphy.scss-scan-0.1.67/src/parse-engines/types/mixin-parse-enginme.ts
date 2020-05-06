import * as gonzales from 'gonzales-pe';
import * as vscode from 'vscode';
import ScssMixinDefinition from '../../common/scss-mixin-definition';
import ParseMixinEngine from '../interface/mixin';
import Mixin from '../typehandler/mixin';

class MixinParseEngine implements ParseMixinEngine {
    public languageId: string = 'scss';

    public parse(textDocument:vscode.TextDocument):ScssMixinDefinition[]{
        let definitions:ScssMixinDefinition[] =[];
        let code: string = textDocument.getText();
        let parseTree:any = gonzales.parse(code,{syntax:'scss'});
        
        parseTree.content.map((item:any)=>{
            if(item.type == 'mixin'){
                definitions.push(Mixin(item));
            }
        });
        return definitions;
    }
}

export default MixinParseEngine;