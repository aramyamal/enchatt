import { RawKeyObject } from "./api";

// helper function to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

// function to hash a string using SHA-256
export async function hashKey(key: RawKeyObject | undefined): Promise<string> {
    if (!key || key.raw.trim() === "") {
        return "";
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(key.raw);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
}

// derive key with PBKDF2 to be used for AES-GCM encryption
export async function deriveAesKey(
    rawKey: string,
    salt: string,
    iterations = 100000
): Promise<CryptoKey> {
    const byteKey: CryptoKey = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(rawKey),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    // derive a 256-bit AES-GCM key
    const aesKey = await window.crypto.subtle.deriveKey(
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

// encrypt using AES-GCM
export async function encrypt(message: string, aesKey: CryptoKey):
    Promise<{ ciphertext: string; iv: string }> {

    const data = new TextEncoder().encode(message);

    // generate a random 12-byte IV for AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        data
    );

    // convert to string
    const encryptedBytes = new Uint8Array(encrypted);
    const ciphertextBase64 = btoa(
        String.fromCharCode(...encryptedBytes)
    );
    const ivBase64 = btoa(
        String.fromCharCode(...iv)
    );

    return { ciphertext: ciphertextBase64, iv: ivBase64 };
}

// decrypt using AES-GCM
export async function decrypt(
    ciphertext: string,
    iv: string,
    aesKey: CryptoKey
): Promise<{ success: boolean; message: string }> {

    try {
        // convert base64 ciphertext and IV back to ArrayBuffer
        const ciphertextBytes = new Uint8Array(
            [...atob(ciphertext)].map(char => char.charCodeAt(0))
        );
        const ivBytes = new Uint8Array(
            [...atob(iv)].map(char => char.charCodeAt(0))
        );

        const decrypted = await window.crypto.subtle.decrypt(
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
