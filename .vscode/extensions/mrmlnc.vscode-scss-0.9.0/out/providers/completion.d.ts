import { CompletionList, TextDocument } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import StorageService from '../services/storage';
export declare function doCompletion(document: TextDocument, offset: number, settings: ISettings, storage: StorageService): Promise<CompletionList>;
