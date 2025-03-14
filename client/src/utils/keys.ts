/**
 * Represents a string type containig key names for interfacing.
 */
export type KeyString = "Key 1" | "Key 2" | "Key 3" | "Key 4";

/**
 * Represents a raw key object containing the original key string, its hashed 
 * version, and an optional cryptographic salt.
 */
export interface RawKeyObject {
    raw: string,
    hashed: string,
    salt?: string
}

/**
 * Represents the 4 raw keys the user may input, where each key is optional.
 */
export interface RawKeys {
    key1?: RawKeyObject
    key2?: RawKeyObject
    key3?: RawKeyObject
    key4?: RawKeyObject
}

/**
 * Represents the 4 derived keys the user may use to encrypt/decrypt messages.
 */
export interface DerivedKeys {
    key1?: CryptoKey;
    key2?: CryptoKey;
    key3?: CryptoKey;
    key4?: CryptoKey;
}

/**
 * Converts a key string (e.g., "Key 1") into its corresponding 
 * object property key (e.g., "key1").
 *
 * @param key - The key string to convert.
 * @returns The corresponding property key in the `RawKeys` type.
 * @throws Will throw an error if the provided key is not recognized.
 */
export function convertToKeyString(key: string): keyof RawKeys {
    switch (key) {
        case "Key 1": return "key1";
        case "Key 2": return "key2";
        case "Key 3": return "key3";
        case "Key 4": return "key4";
        default: throw new Error(`Unknown key: ${key}`);
    }
};

/**
 * Retrieves the CSS class name associated with a given `KeyString` value.
 *
 * @param keyString - The key string to map to a class name.
 * @returns The corresponding CSS class name.
 */
export function getKeyClass(keyString: KeyString): string {
    switch (keyString) {
        case "Key 1":
            return "key1";
        case "Key 2":
            return "key2";
        case "Key 3":
            return "key3";
        case "Key 4":
            return "key4";
        default:
            return "key1";
    }
}
