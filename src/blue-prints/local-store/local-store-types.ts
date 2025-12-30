import { LocalStoreKeys } from '@local-store/local-store-keys';

export interface LocalStoreError {
    message: string;
    key?: LocalStoreKeys;
    error?: unknown;
}

export interface LocalStoreResponse<T> {
    data: T | null;
    error: LocalStoreError | null;
} 