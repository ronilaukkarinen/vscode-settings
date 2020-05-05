import { SignatureHelp, TextDocument } from 'vscode-languageserver';
import StorageService from '../services/storage';
export declare function doSignatureHelp(document: TextDocument, offset: number, storage: StorageService): Promise<SignatureHelp>;
