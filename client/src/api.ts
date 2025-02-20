import axios from "axios";

axios.defaults.withCredentials = true;

export type Chat = {
    messages: Message[];
}

export type Message = {
    sender: string;
    time: number;
    content: string;
}

// TODO: change for finished product
const BASE_URL = "http://localhost:8080";

export async function getMultipleChats(keys: string[]): Promise<Chat> {
    const chatPromises = axios.get<Chat>(`${BASE_URL}/chats/` , {
            params : {
                key1 : keys[0],
                key2 : keys[1],
                key3 : keys[2],
                key4 : keys[3]
            }
        }).then(res => res.data);

    return await chatPromises;
}

export async function createMessage(sender: string,
    content: string, key: string): Promise<Message> {
    const message = {
        sender: sender,
        content: content
    };
    const response = await axios.post<Message>(`${BASE_URL}/chat/${key}`, message);
    return response.data;
}   
