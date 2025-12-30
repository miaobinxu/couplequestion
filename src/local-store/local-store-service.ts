import { mmkvStorage } from '@local-store/mmkv';
import { LocalStoreKeys } from '@local-store/local-store-keys';
import { LocalStoreError, LocalStoreResponse } from '@blue-prints/local-store/local-store-types';

export const setValue = (key: LocalStoreKeys, value: string): LocalStoreError | null => {
    try {
        mmkvStorage.set(key, value);
        return null;
    } catch (error) {
        return {
            message: 'Failed to save data',
            key,
            error
        };
    }
};

export const getValue = (key: LocalStoreKeys): LocalStoreResponse<string> => {
    try {
        const hasKey = mmkvStorage.contains(key);
        if (hasKey) {
            const value = mmkvStorage.getString(key);
            return { data: value as string, error: null };
        }
        else {
            return {
                data: null,
                error: {
                    message: 'Failed to get data',
                    key,
                    error: 'No data found'
                }
            };
        }
    } catch (error) {
        return {
            data: null,
            error: {
                message: 'Failed to get data',
                key,
                error
            }
        };
    }
};

export const setObject = <T>(key: LocalStoreKeys, value: T): LocalStoreError | null => {
    try {
        const jsonValue = JSON.stringify(value);
        mmkvStorage.set(key, jsonValue);
        return null;
    } catch (error) {
        return {
            message: 'Failed to save object',
            key,
            error
        };
    }
};

export const getObject = <T>(key: LocalStoreKeys): LocalStoreResponse<T> => {
    try {
        const hasKey = mmkvStorage.contains(key);
        if (hasKey) {
            const jsonValue = mmkvStorage.getString(key);
            return {
                data: jsonValue ? JSON.parse(jsonValue) : null,
                error: null
            };
        }
        else {
            return {
                data: null,
                error: {
                    message: 'Failed to get data',
                    key,
                    error: 'No data found'
                }
            };
        }
    } catch (error) {
        return {
            data: null,
            error: {
                message: 'Failed to get data',
                key,
                error
            }
        };
    }
};

export const deleteValue = (key: LocalStoreKeys): LocalStoreError | null => {
    try {
        mmkvStorage.delete(key);
        return null;
    } catch (error) {
        return {
            message: 'Failed to delete data',
            key,
            error
        };
    }
};

export const clearAll = (): LocalStoreError | null => {
    try {
        mmkvStorage.clearAll();
        return null;
    } catch (error) {
        return {
            message: 'Failed to clear data',
            error
        };
    }
};
