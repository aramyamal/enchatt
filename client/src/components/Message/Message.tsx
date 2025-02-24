import { Message, KeyString } from "../../api";
import classes from "./Message.module.css";

export function MessageComponent({ message }: { message: Message }) {

    function getKeyClass(keyString: KeyString) {
        switch (keyString) {
            case "Key 1":
                return classes.key1;
            case "Key 2":
                return classes.key2;
            case "Key 3":
                return classes.key3;
            case "Key 4":
                return classes.key4;
            default:
                return;
        }
    }

    return (
        <>
            <div className="my-2">
                <span className={`font-serif ${getKeyClass(message.key)}`}>{message.sender}:</span> {message.content}
            </div>
        </>
    );
}