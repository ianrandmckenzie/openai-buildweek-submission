import type { EncryptedEnvelope } from './models';

export interface CryptoProvider {
  encrypt(value: string): Promise<EncryptedEnvelope>;
  decrypt(envelope: EncryptedEnvelope): Promise<string>;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

export function createCryptoProvider(key: CryptoKey): CryptoProvider {
  if (key.type !== 'secret' || key.algorithm.name !== 'AES-GCM') {
    throw new Error('A secret AES-GCM CryptoKey is required');
  }
  return {
    async encrypt(value) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as unknown as BufferSource }, key, encoder.encode(value) as unknown as BufferSource);
      return { version: 1, algorithm: 'AES-GCM', iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) };
    },
    async decrypt(envelope) {
      if (envelope.version !== 1 || envelope.algorithm !== 'AES-GCM') throw new Error('Unsupported ciphertext envelope');
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(envelope.iv) as unknown as BufferSource }, key, fromBase64(envelope.ciphertext) as unknown as BufferSource);
      return decoder.decode(plaintext);
    },
  };
}
