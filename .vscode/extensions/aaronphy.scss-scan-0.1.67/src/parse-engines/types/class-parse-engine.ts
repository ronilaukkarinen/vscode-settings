import * as gonzales from 'gonzales-pe';
import * as vscode from 'vscode';
import ScssClassDefinition from '../../common/scss-class-definition';
import ParseClassEngine from '../interface/class';

class ClassParseEngine implements ParseClassEngine {
    public languageId: string = 'scss';

    public parse(textDocument:vscode.TextDocument):ScssClassDefinition[]{
        let definitions:ScssClassDefinition[] =[];
        let code: string = textDocument.getText();
        let parseTree:any = gonzales.parse(code,{syntax:'scss'});
        
        parseTree.content.forEach((item:any)=>{
            definitions.push(new ScssClassDefinition(item.content));
        });
        return definitions;
    }
}

export default ClassParseEngine;