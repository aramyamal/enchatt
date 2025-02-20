export interface Message {
    sender: string;
    time: number;
    content: string;
    key?: "Key 1" | "Key 2" | "Key 3" | "Key 4";
}
