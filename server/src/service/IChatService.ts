import { ChatsModel } from "../../db/chats.db"
import { messagesModel } from "../../db/messages.db"

export interface IChatService {
    getOrCreateChat(key: string): Promise<ChatsModel>
    sendMessage(key: string, sender: string, content: string, iv: string): Promise<messagesModel>
    getOrCreateMultipleChats(
        key1: string,
        key2: string,
        key3: string,
        key4: string
    ):Promise<{ messages: messagesModel[], salts: (string | null)[] }>
}