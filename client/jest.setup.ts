
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

declare global {
  interface TextDecoderOptions {
    stream?: boolean;
  }
  interface TextDecodeOptions {
    stream?: boolean;
  }
}

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

global.crypto = {
  subtle: {
    digest: jest.fn(),
    importKey: jest.fn(),
    deriveKey: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
} as unknown as Crypto;