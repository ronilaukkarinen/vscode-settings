'use strict';

import MixinParse from './interface/mixin';
import MixinParseEngine from './types/mixin-parse-enginme';

class MixinEngineRegistry {
    private static _supportedLanguagesIds:string[];
    private static _registry: MixinParseEngine[]= [
        new MixinParseEngine()
    ];

    public static get supportedLanguagesIds(): string[] {
        if(!MixinEngineRegistry._supportedLanguagesIds) {
            MixinEngineRegistry._supportedLanguagesIds = MixinEngineRegistry._registry.reduce<string[]>(
                (previousValue: string[],currentValue: MixinParse,currentIndex:number,array:MixinParse[])=> {
                    previousValue.push(currentValue.languageId)
                    return previousValue;
                }, []);
        }
        return MixinEngineRegistry._supportedLanguagesIds;
    }
    
    public static getParseEngine(languageId:string): MixinParse {
        let foundParseEngine:MixinParse = MixinEngineRegistry._registry.find((value: MixinParse,index: number,obj:MixinParse[]) => {
            return value.languageId === languageId;
        });

        if(!foundParseEngine){
            throw `Could not find a parse engine for the provided language id ("${languageId}")`
        }

        return foundParseEngine;
    } 

}

export default MixinEngineRegistry;