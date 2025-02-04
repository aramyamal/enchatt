import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";

export class ChatService {
    private chats: Map<string, Chat> = new Map(); //replace with database

    async createOrGetChat(key: string): Promise<Chat> {
        if (!this.chats.has(key)) {
            const newChat: Chat = { messages: [] };
            this.chats.set(key, newChat);
            return JSON.parse(JSON.stringify(this.chats.get(key))); //get deep copy
        }
        return JSON.parse(JSON.stringify(this.chats.get(key)));
    }

    async sendMessage(key: string, sender: string, content: string): Promise<boolean> {
        const message: Message = {
            sender: sender,
            time: Date.now(),
            content: content
        };

        const chat: Chat | undefined = this.chats.get(key);
        if (!chat) {
            return false;
        }
        chat.messages.push(message);
        return true;
    }
}
