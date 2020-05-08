export interface ISettings {
    scannerDepth: number;
    scannerExclude: string[];
    scanImportedFiles: boolean;
    implicitlyLabel: string | null;
    showErrors: boolean;
    suggestVariables: boolean;
    suggestMixins: boolean;
    suggestFunctions: boolean;
    suggestFunctionsInStringContextAfterSymbols: string;
}
