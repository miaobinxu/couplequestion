// mmkvStorageAdapter.ts
import { mmkvStorage } from "@local-store/mmkv";

export const zustandMMKVStorage = {
  getItem: (name: string) => {
    const value = mmkvStorage.getString(name);

    return value ? JSON.parse(value) : null;
  },

  setItem: (name: string, value: any) => {
    mmkvStorage.set(name, JSON.stringify(value));
  },

  removeItem: (name: string) => {
    mmkvStorage.delete(name);
  },
};
