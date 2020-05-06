'use strict';

import VariableParse from './interface/variable';
import VariableParseEngine from './types/variable-parse-engine';

class VariableEngineRegistry {
    private static _supportedLanguagesIds:string[];
    private static _registry: VariableParseEngine[]= [
        new VariableParseEngine()
    ];

    public static get supportedLanguagesIds(): string[] {
        if(!VariableEngineRegistry._supportedLanguagesIds) {
            VariableEngineRegistry._supportedLanguagesIds = VariableEngineRegistry._registry.reduce<string[]>(
                (previousValue: string[],currentValue: VariableParse,currentIndex:number,array:VariableParse[])=> {
                    previousValue.push(currentValue.languageId)
                    return previousValue;
                }, []);
        }
        return VariableEngineRegistry._supportedLanguagesIds;
    }
    
    public static getParseEngine(languageId:string): VariableParse {
        let foundParseEngine:VariableParse = VariableEngineRegistry._registry.find((value: VariableParse,index: number,obj:VariableParse[]) => {
            return value.languageId === languageId;
        });

        if(!foundParseEngine){
            throw `Could not find a parse engine for the provided language id ("${languageId}")`
        }

        return foundParseEngine;
    } 

}

export default VariableEngineRegistry;