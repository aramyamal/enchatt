/**
  * Hashes raw key string using SHA-256 and returns the result in string format.
  *
  * @param rawKey - The key in string format that is to be hashed. If undefined
  * or empty, returns an empty string.
  * @returns A Promise resolving to the SHA-256 hash as a hexadecimal string.
  */
export async function hashKey(rawKey: string | undefined): Promise<string> {
    if (!rawKey || rawKey.trim() === "") {
        return "";
    }
    const data: Uint8Array = new TextEncoder().encode(rawKey);
    const hashBuffer: ArrayBuffer = await window.crypto.subtle
        .digest('SHA-256', data);
    
    // convert data in form ArrayBuffer to hex string before returning
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

}

/**
 * Derives an AES-GCM key from a raw key using PBKDF2.
 *
 * @param rawKey - The raw key to derive the AES-GCM key from.
 * @param salt - The salt used in the key derivation.
 * @param iterations - The number of PBKDF2 iterations (default: 100000).
 * @returns A Promise resolving to the derived CryptoKey for AES-GCM encryption.
 */
export async function deriveAesKey(
    rawKey: string,
    salt: string,
    iterations = 100000
): Promise<CryptoKey> {
    // import key for use with PBKDF2 
    const byteKey: CryptoKey = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(rawKey),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    // derive a 256-bit key with PBKDF2
    const aesKey: CryptoKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new TextEncoder().encode(salt),
            iterations,
            hash: "SHA-256",
        },
        byteKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    return aesKey;
}

interface EncryptedData {
    ciphertext: string;
    iv: string;
}

/**
 * Encrypts a message using AES-GCM, with a randomly generated IV that is
 * returned with the ciphertext as strings in an EncryptedData object.
 *
 * @param message - The message string to encrypt.
 * @param aesKey - The AES-GCM CryptoKey used for encryption.
 * @returns A Promise resolving to an EncryptedData object containing the 
 * base64-encoded ciphertext and IV.
 */
export async function encrypt(message: string, aesKey: CryptoKey):
    Promise<EncryptedData> {

    const data: Uint8Array = new TextEncoder().encode(message);

    // generate a random 12-byte IV for AES-GCM
    const iv: Uint8Array = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted: ArrayBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        data
    );

    // convert to string
    const encryptedBytes: Uint8Array = new Uint8Array(encrypted);
    const ciphertextBase64: string = btoa(
        String.fromCharCode(...encryptedBytes)
    );
    const ivBase64: string = btoa(
        String.fromCharCode(...iv)
    );

    return { ciphertext: ciphertextBase64, iv: ivBase64 };
}

interface DecryptionData {
    success: boolean;
    message: string;
}

/**
 * Decrypts a ciphertext string using AES-GCM with IV.
 *
 * @param ciphertext - The base64-encoded ciphertext string to decrypt.
 * @param iv - The base64-encoded IV string used during encryption.
 * @param aesKey - The AES-GCM CryptoKey used for decryption.
 * @returns A Promise resolving to a DecryptionData object containing the 
 * success status and decrypted message.
 */
export async function decrypt(
    ciphertext: string,
    iv: string,
    aesKey: CryptoKey
): Promise<DecryptionData> {

    try {
        // convert base64 ciphertext and IV back to ArrayBuffer
        const ciphertextBytes: Uint8Array = new Uint8Array(
            [...atob(ciphertext)].map(char => char.charCodeAt(0))
        );
        const ivBytes: Uint8Array = new Uint8Array(
            [...atob(iv)].map(char => char.charCodeAt(0))
        );

        const decrypted: ArrayBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivBytes },
            aesKey,
            ciphertextBytes
        );

        // convert decrypted to string and return
        return {
            success: true,
            message: new TextDecoder().decode(decrypted)
        };

    } catch (error: unknown) {
        console.error("Decryption error details:", error);

        if (error instanceof Error && error.name === "OperationError") {
            return {
                success: false,
                message: "[Decryption failed - message may be corrupted or using different key]"
            };
        } else if (error instanceof Error) {
            return {
                success: false,
                message: `[Decryption error: ${error.message}]`
            };
        } else {
            return {
                success: false,
                message: "[Unknown decryption error]"
            };
        }
    }
}
