import { Message } from "./message.interface";
export interface Chat {
    readonly key : string;
    messages: Message[];
}
