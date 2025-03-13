import axios from "axios";

axios.defaults.withCredentials = true;

export type Chat = {
    messages: Message[];
    salts: (string | undefined)[];
}

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

export type Message = {
    chatKey: string,
    sender: string,
    time: number,
    content: string,
    key: KeyString
    iv: string;
}

// TODO: change for finished product
const BASE_URL = "http://localhost:8080";

export async function getMultipleChats(rawKeys: RawKeys): Promise<Chat> {
    const chatPromises = axios.get<Chat>(`${BASE_URL}/chats/`, {
        params: {
            key1: rawKeys.key1?.hashed ?
                  rawKeys.key1.hashed :
                  "",
            key2: rawKeys.key2?.hashed ?
                  rawKeys.key2.hashed :
                  "",
            key3: rawKeys.key3?.hashed ?
                  rawKeys.key3.hashed :
                  "",
            key4: rawKeys.key4?.hashed ?
                  rawKeys.key4.hashed :
                  "",
        }
    }).then(res => res.data);

    return await chatPromises;
}

export async function createMessage(sender: string,
    content: string, iv: string, rawKey: RawKeyObject): Promise<Message> {
    const hashedKey: string = rawKey.hashed;
    const message = {
        sender: sender,
        content: content,
        iv: iv
    };
    const response = await axios.post<Message>(`${BASE_URL}/chat/${hashedKey}`, message);
    return response.data;
}   
