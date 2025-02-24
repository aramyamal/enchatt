import { Message, getKeyClass} from "../../api";
import classes from "./Message.module.css";

export function MessageComponent({ message }: { message: Message }) {

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