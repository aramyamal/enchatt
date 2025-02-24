<<<<<<< HEAD
import { Chat, getMultipleChats } from "../../api";
import { useState, useEffect} from "react";
=======
import { Message, Chat, getMultipleChats } from "../../api";
import { useState, useEffect } from "react";
>>>>>>> 5567051 (feat(chat): add check to only fetch when keys not empty)
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { activeKeys: string[] }) {
    const { activeKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [] });


    async function loadChats(keys: string[]) {
<<<<<<< HEAD
        try {
            const multipleChats: Chat = await getMultipleChats(keys);
            setChat({ messages: multipleChats?.messages })
        }catch (error){
            console.error("Failed to fetch chats:", error);
        }   
=======
        const multipleChats: Chat = await getMultipleChats(keys);

        setChat({ messages: multipleChats.messages })
>>>>>>> 5567051 (feat(chat): add check to only fetch when keys not empty)
    }

    useEffect(() => {
        loadChats(activeKeys);
        const interval = setInterval(() => {
            if (activeKeys.some(key => key.trim() !== "")) {
                loadChats(activeKeys);
<<<<<<< HEAD
<<<<<<< HEAD
            } else {
                setChat({ messages: [] });
=======
>>>>>>> 5567051 (feat(chat): add check to only fetch when keys not empty)
=======
            } else {
                setChat({ messages: [] });
>>>>>>> 5b173a2 (fix(ChatBox): handle empty keys)
            }
        }, 3000); // call every 3 seconds

        return () => clearInterval(interval);
    }, [activeKeys]); // activeKey as dependency

    return (
        <>
          {chat.messages.map((message, index) => (
            <MessageComponent key={`message-${index}`} message={message} />
          ))}
        </>
      );
}