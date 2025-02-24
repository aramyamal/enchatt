import { Message, KeyString } from "../../api";
import classes from "./Message.module.css";

export function MessageComponent({ message }: { message: Message }) {

    function getKeyClass(keyString: KeyString) {
        switch (keyString) {
            case "Key 1":
                return "key1";
            case "Key 2":
                return "key2";
            case "Key 3":
                return "key3";
            case "Key 4":
                return "key4";
            default:
                return;
        }
    }

    return (
        <>
            <div className="my-2">
                <span className={`font-serif-bold ${getKeyClass(message.key)}`}>
                    {message.sender}:
                </span>
                <span className={`font-mono ${getKeyClass(message.key)}`}>
                     {" " + message.content}
                </span>
            </div>
        </>
    );
}