/**
 * Returns word by specified position.
 */
export declare function getCurrentWord(text: string, offset: number): string;
/**
 * Returns text before specified position.
 */
export declare function getTextBeforePosition(text: string, offset: number): string;
/**
 * Returns text after specified position.
 */
export declare function getTextAfterPosition(text: string, offset: number): string;
/**
 * Limit of string length.
 */
export declare function getLimitedString(str: string, ellipsis?: boolean): string;
