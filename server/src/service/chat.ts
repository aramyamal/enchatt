import { HttpError } from "../errors/HttpError";
import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";

export class ChatService {
    private chats: Map<string, Chat> = new Map(); //replace with database
    private multipleChats: Map<string , Chat> = new Map();

    // should this be async?
    private getChat(key: string): Chat {
        const chat = this.chats.get(key);
        if (!chat) {
            throw new HttpError(404, `Chat with key ${key} not found.`);
        }
        return chat;
    }

    private createChat(key: string): Chat {
        const newChat: Chat = { messages: [] };
        this.chats.set(key, newChat);
        return newChat;
    }

    /**
    * Get chat associated with input key, if no chat exists with for that key, 
    * create a new chat for it instead
    * @returns Deep copy of chat associated with input key
    */
    async getOrCreateChat(key: string): Promise<Chat> {
        if (!this.chats.has(key)) {
            this.createChat(key);
        }
        return structuredClone(this.getChat(key));
    }

    /**
    * Sends a message to a chat associated with input key
    * @returns The created Message object
    * @throws {Error} if message content is empty after whitespace removal
    */
    async sendMessage(key: string, sender: string, content: string): Promise<Message> {
        if (!content.trim()) { //remove trailing white space and check if resulting is empty
            throw new HttpError(400, "Message content empty.");
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

    async getOrCreateMultipleChats(key1: string, key2: string): Promise<Chat[]>{
        if(!this.chats.has(key1)) {
            const newChat: Chat = this.createChat(key1)
            this.multipleChats.set(key1, newChat)
        }
        if(!this.chats.has(key2)){
            const new2Chat: Chat = this.createChat(key2)
            this.multipleChats.set(key2, new2Chat)
        }
        
        return [this.multipleChats.get(key1)!,this.multipleChats.get(key2)! ];
    }
}
