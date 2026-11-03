export type SecretStore = {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
};
// Small chunks stay below SecureStore's platform value limits, including Unicode.
export function createSecureSessionStorage(store: SecretStore) {
  let sequence = 0;
  let pending: Promise<unknown> = Promise.resolve();
  const serialize = <T>(operation: () => Promise<T>): Promise<T> => {
    const next = pending.then(operation, operation);
    pending = next.catch(() => undefined);
    return next;
  };
  const manifestKey = (key: string) => `${key}.manifest`;
  async function keysFor(key: string): Promise<string[]> {
    const value = await store.getItemAsync(manifestKey(key));
    if (!value) return [];
    try {
      const data = JSON.parse(value);
      if (data.version !== 1 || !Number.isInteger(data.count) || data.count < 1 || data.count > 256
        || typeof data.revision !== "string" || !/^[a-z0-9]+-[0-9]+$/.test(data.revision)) return [];
      return Array.from({ length: data.count }, (_, index) => `${key}.chunk.${data.revision}.${index}`);
    } catch { return []; }
  }
  return {
    getItem: (key: string) => serialize(async () => {
      const keys = await keysFor(key);
      if (!keys.length) return null;
      const chunks = await Promise.all(keys.map(k => store.getItemAsync(k)));
      return chunks.some(c => c === null) ? null : chunks.join("");
    }),
    setItem: (key: string, value: string) => serialize(async () => {
      if (!value || value.length > 100000) throw new Error("Sessão excede o limite de armazenamento seguro.");
      const previous = await keysFor(key);
      const revision = `${Date.now().toString(36)}-${sequence++}`;
      const keys: string[] = [];
      const characters = Array.from(value);
      try {
        for (let offset = 0; offset < characters.length; offset += 400) {
          const chunkKey = `${key}.chunk.${revision}.${keys.length}`;
          keys.push(chunkKey);
          await store.setItemAsync(chunkKey, characters.slice(offset, offset + 400).join(""));
        }
        // Commit the manifest last: interrupted writes never replace a valid session.
        await store.setItemAsync(manifestKey(key), JSON.stringify({ version: 1, revision, count: keys.length }));
      } catch (error) {
        await Promise.allSettled(keys.map(k => store.deleteItemAsync(k)));
        throw error;
      }
      await Promise.allSettled(previous.map(k => store.deleteItemAsync(k)));
    }),
    removeItem: (key: string) => serialize(async () => {
      const keys = await keysFor(key);
      await store.deleteItemAsync(manifestKey(key));
      await Promise.allSettled(keys.map(k => store.deleteItemAsync(k)));
    }),
  };
}
