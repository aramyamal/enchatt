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
