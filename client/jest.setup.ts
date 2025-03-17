import '@testing-library/jest-dom';

window.crypto = {
  subtle: {
    importKey: jest.fn().mockResolvedValue('mockKey'),
    deriveKey: jest.fn().mockResolvedValue('mockKey'),
    deriveBits: jest.fn().mockResolvedValue(new ArrayBuffer(16)),
  },
} as unknown as Crypto;


console.log('window.crypto.subtle:', window.crypto.subtle);