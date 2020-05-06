'use strict';

import ClassParse from './interface/class';
import ClassParseEngine from './types/class-parse-engine';

class ParseEngineRegistry {
    
    private static _supportedLanguagesIds:string[];
    
    private static _registry: ClassParseEngine[]= [
        new ClassParseEngine()
    ];

    public static get supportedLanguagesIds(): string[] {
        if(!ParseEngineRegistry._supportedLanguagesIds) {
            ParseEngineRegistry._supportedLanguagesIds = ParseEngineRegistry._registry.reduce<string[]>(
                (previousValue: string[],currentValue: ClassParse,currentIndex:number,array:ClassParse[])=> {
                    previousValue.push(currentValue.languageId)
                    return previousValue;
                }, []);
        }
        return ParseEngineRegistry._supportedLanguagesIds;
    }
    
    public static getParseEngine(languageId:string): ClassParse {
        let foundParseEngine:ClassParse = ParseEngineRegistry._registry.find((value: ClassParse,index: number,obj:ClassParse[]) => {
            return value.languageId === languageId;
        });

        if(!foundParseEngine){
            throw `Could not find a parse engine for the provided language id ("${languageId}")`
        }

        return foundParseEngine;
    } 

}

export default ParseEngineRegistry;