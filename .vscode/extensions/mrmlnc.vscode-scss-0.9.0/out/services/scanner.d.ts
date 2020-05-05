import { ISettings } from '../types/settings';
import StorageService from './storage';
export default class ScannerService {
    private readonly _storage;
    private readonly _settings;
    constructor(_storage: StorageService, _settings: ISettings);
    scan(files: string[], recursive?: boolean): Promise<void>;
    protected _readFile(filepath: string): Promise<string>;
    protected _fileExists(filepath: string): Promise<boolean>;
}
