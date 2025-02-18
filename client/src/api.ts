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

export async function getChat(key: string): Promise<Chat> {
    const response = await axios.get<Chat>(`${BASE_URL}/chat/${key}`)
    return response.data;
}

export async function createMessage(sender: string,
    content: string, key: string): Promise<Message> {
    const message = {
        key: key,
        sender: sender,
        content: content
    };
    const response = await axios.post<Message>(`${BASE_URL}/chat/`, message);
    return response.data;
}   
