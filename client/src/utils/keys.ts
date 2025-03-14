export type KeyString = "Key 1" | "Key 2" | "Key 3" | "Key 4";

export interface RawKeyObject {
    raw: string,
    hashed: string,
    salt?: string
}

export interface RawKeys {
    key1?: RawKeyObject
    key2?: RawKeyObject
    key3?: RawKeyObject
    key4?: RawKeyObject
}

export interface DerivedKeys {
    key1?: CryptoKey;
    key2?: CryptoKey;
    key3?: CryptoKey;
    key4?: CryptoKey;
}

export interface HashedKeys {
    key1?: string;
    key2?: string;
    key3?: string;
    key4?: string;
}

export function convertToKeyString(key: string): keyof RawKeys {
    switch (key) {
        case "Key 1": return "key1";
        case "Key 2": return "key2";
        case "Key 3": return "key3";
        case "Key 4": return "key4";
        default: throw new Error(`Unknown key: ${key}`);
    }
};

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
