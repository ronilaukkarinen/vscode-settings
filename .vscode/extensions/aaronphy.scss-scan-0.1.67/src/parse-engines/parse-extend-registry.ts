'use strict';

import ExtendParse from './interface/extend';
import ExtendParseEngine from './types/extend-parse-engine';

class ExtendEngineRegistry {
    private static _supportedLanguagesIds:string[];
    private static _registry: ExtendParseEngine[]= [
        new ExtendParseEngine()
    ];

    public static get supportedLanguagesIds(): string[] {
        if(!ExtendEngineRegistry._supportedLanguagesIds) {
            ExtendEngineRegistry._supportedLanguagesIds = ExtendEngineRegistry._registry.reduce<string[]>(
                (previousValue: string[],currentValue: ExtendParse,currentIndex:number,array:ExtendParse[])=> {
                    previousValue.push(currentValue.languageId)
                    return previousValue;
                }, []);
        }
        return ExtendEngineRegistry._supportedLanguagesIds;
    }
    
    public static getParseEngine(languageId:string): ExtendParse {
        let foundParseEngine:ExtendParse = ExtendEngineRegistry._registry.find((value: ExtendParse,index: number,obj:ExtendParse[]) => {
            return value.languageId === languageId;
        });

        if(!foundParseEngine){
            throw `Could not find a parse engine for the provided language id ("${languageId}")`
        }

        return foundParseEngine;
    } 

}

export default ExtendEngineRegistry;