import { Message } from "../../api";

export function MessageComponent({ message }: { message: Message }) {
    return (
        <>
            <div className="my-2">
                <span className="font-serif">{message.sender}:</span> {message.content}
            </div>
        </>
    );
}
