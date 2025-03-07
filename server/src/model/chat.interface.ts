import { Message } from "./message.interface";
export interface Chat {
    messages: Message[];
    salt: string;
}

export interface CombinedChat {
    messages: Message[];
    salts: (string | undefined)[];
}
