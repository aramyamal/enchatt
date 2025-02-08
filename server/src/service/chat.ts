import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";

export class ChatService {
    private chats: Map<string, Chat> = new Map(); //replace with database

    // should this be async?
    private getChat(key: string): Chat {
        const chat = this.chats.get(key);
        if (!chat) {
            throw new Error(`Chat with key ${key} not found.`);
        }
        return chat;
    }

    private createChat(key: string): Chat {
        const newChat: Chat = { messages: [] };
        this.chats.set(key, newChat);
        return newChat;
    }

    /**
    * Get chat for a key, if no chat exists with that key, create chat for that 
    * key instead
    * @returns Deep copy that chat
    */
    async getOrCreateChat(key: string): Promise<Chat> {
        if (!this.chats.has(key)) {
            this.createChat(key);
        }
        return structuredClone(this.getChat(key));
    }

    async sendMessage(key: string, sender: string, content: string): Promise<Message> {
        if (!content.trim()) { //remove trailing white space and check if resulting is empty
            throw new Error("Message content empty.")
        }

        const chat: Chat = this.getChat(key);

        const message: Message = {
            sender: sender,
            time: Date.now(),
            content: content
        };

        chat.messages.push(message);
        return message;
    }
}
