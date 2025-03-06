import axios from "axios";
import { hashKey } from "./encryption";

axios.defaults.withCredentials = true;

export type Chat = {
    messages: Message[];
}

export type KeyString = "Key 1" | "Key 2" | "Key 3" | "Key 4";

export interface RawKeyObject {
    raw: string,
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
    sender: string,
    time: number,
    content: string,
    key: KeyString
}

// TODO: change for finished product
const BASE_URL = "http://localhost:8080";

export async function getMultipleChats(rawKeys: RawKeys): Promise<Chat> {
    const chatPromises = axios.get<Chat>(`${BASE_URL}/chats/`, {
        params: {
            key1: await hashKey(rawKeys.key1),
            key2: await hashKey(rawKeys.key2),
            key3: await hashKey(rawKeys.key3),
            key4: await hashKey(rawKeys.key4),
        }
    }).then(res => res.data);

    return await chatPromises;
}

export async function createMessage(sender: string,
    content: string, rawKey: RawKeyObject): Promise<Message> {
    const hashedKey: string = await hashKey(rawKey);
    const message = {
        sender: sender,
        content: content
    };
    const response = await axios.post<Message>(`${BASE_URL}/chat/${hashedKey}`, message);
    return response.data;
}   
