import { MMKVLoader } from 'react-native-mmkv-storage'

const storage = new MMKVLoader().initialize()

// Create a custom storage implementation using MMKV that returns promises
export const MMKVStorageAdapter = {
 getItem: async (key: string): Promise<string | null> => {
  const value = storage.getString(key)
  return value || null
 },
 setItem: async (key: string, value: string): Promise<void> => {
  storage.setString(key, value)
 },
 removeItem: async (key: string): Promise<void> => {
  storage.removeItem(key)
 },
}
