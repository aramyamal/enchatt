import { HttpError } from "../errors/HttpError";
import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";
import { IChatService } from "./IChatService";

export class ChatService implements IChatService {
    private chats: Map<string, Chat> = new Map(); //replace with database
    private multipleChats: Map<string, Chat> = new Map();

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

    async getOrCreateMultipleChats(
        key1: string,
        key2: string,
        key3: string,
        key4: string
    ): Promise<Chat> {
        const keys: string[] = [key1, key2, key3, key4];
        for (const key of keys) {
            if (!this.chats.has(key)) {
                const newChat: Chat = this.createChat(key);
                this.chats.set(key, newChat);
            }
        }

        const requestedChats: (Chat | undefined)[] = keys.map(
            key => this.chats.get(key));

        let validChats: Chat[] = [];
        for (const chat of requestedChats) {
            if (chat) {
                validChats.push(chat);
            }
        } 

        if (validChats.length === 0) {
            throw new HttpError(500, "Failed to retrieve chats");
        }

        return this.combineChats(validChats);

        // if (!this.chats.has(key1)) {
        //     const newChat: Chat = this.createChat(key1)
        //     this.multipleChats.set(key1, newChat)
        // }
        // if (!this.chats.has(key2)) {
        //     const new2Chat: Chat = this.createChat(key2)
        //     this.multipleChats.set(key2, new2Chat)
        // }
        //
        // return [this.multipleChats.get(key1)!, this.multipleChats.get(key2)!];
    }

    private combineChats(chats: Chat[]): Chat {
        var combinedChat: Chat = { messages: [] };

        for (const [index, chat] of chats.entries()) {

            const key: string = `Key ${index + 1}` as
                "Key 1" | "Key 2" | "Key 3" | "Key 4";

            const updatedMessages: Message[] = chat.messages.map(message => ({
                sender: message.sender,
                time: message.time,
                content: message.content,
                key: key as "Key 1" | "Key 2" | "Key 3" | "Key 4"
            }));

            combinedChat.messages.push(...updatedMessages);
        }

        combinedChat.messages.sort((a, b) => a.time - b.time);

        return combinedChat;
    }

    async getOrCreateMultipleChats1(keys : string[]): Promise<Chat[]>{
        const multipleChats : Chat[] = []

        keys.forEach((key) => {
            if (!this.chats.has(key)) {
                this.createChat(key)
            }
            multipleChats.push(this.getChat(key))
        })

        return structuredClone(multipleChats);
    }

}
