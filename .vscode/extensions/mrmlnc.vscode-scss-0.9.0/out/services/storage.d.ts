import { ISymbols } from '../types/symbols';
export declare type Storage = Map<StorageItemKey, StorageItemValue>;
export declare type StorageItemEntry = [StorageItemKey, StorageItemValue];
export declare type StorageItemKey = string;
export declare type StorageItemValue = ISymbols;
export default class StorageService {
    private readonly _storage;
    get(key: StorageItemKey): StorageItemValue | undefined;
    set(key: StorageItemKey, value: StorageItemValue): void;
    delete(key: string): void;
    clear(): void;
    keys(): StorageItemKey[];
    values(): StorageItemValue[];
    entries(): StorageItemEntry[];
}
