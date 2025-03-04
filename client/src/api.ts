import axios from "axios";
import { hashKey } from "./encryption";

axios.defaults.withCredentials = true;

export type Chat = {
    messages: Message[];
}

export type KeyString = "Key 1" | "Key 2" | "Key 3" | "Key 4" | undefined;

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

export async function getMultipleChats(keys: string[]): Promise<Chat> {
    const chatPromises = axios.get<Chat>(`${BASE_URL}/chats/`, {
        params: {
            key1: await hashKey(keys[0]),
            key2: await hashKey(keys[1]),
            key3: await hashKey(keys[2]),
            key4: await hashKey(keys[3]),
        }
    }).then(res => res.data);

    return await chatPromises;
}

export async function createMessage(sender: string,
    content: string, key: string): Promise<Message> {
    const hashedKey: string = await hashKey(key);
    const message = {
        sender: sender,
        content: content
    };
    const response = await axios.post<Message>(`${BASE_URL}/chat/${hashedKey}`, message);
    return response.data;
}   
