import axios from "axios";
import { KeyString, RawKeyObject, RawKeys } from "./utils/keys";

axios.defaults.withCredentials = true;

export type Chat = {
    messages: Message[];
    salts: (string | undefined)[];
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
