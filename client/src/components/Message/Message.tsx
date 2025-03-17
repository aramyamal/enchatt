import { Message } from "../../api";
import {  DerivedKeys, RawKeys } from "../../utils/keys";
import { decrypt } from "../../utils/encryption";
import { useEffect, useState } from "react";

export function MessageComponent({ message, derivedKeys, rawKeys }: { message: Message, derivedKeys: DerivedKeys, rawKeys: RawKeys }) {
    const [decryptedContent, setDecryptedContent] = useState<string>("");
    const [decryptedUsername, setDecryptedUsername ] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    function extractDerivedKey(derivedKeys: DerivedKeys, chatKey: string): CryptoKey {
        let cryptoKey: CryptoKey | undefined;
        switch (chatKey) {
            case rawKeys.key1?.hashed:
                cryptoKey = derivedKeys.key1;
                break;
            case rawKeys.key2?.hashed:
                cryptoKey = derivedKeys.key2;
                break;
            case rawKeys.key3?.hashed:
                cryptoKey = derivedKeys.key3;
                break;
            case rawKeys.key4?.hashed:
                cryptoKey = derivedKeys.key4;
                break;
        }
        if (cryptoKey) {
            return cryptoKey;
        } else {
            throw new Error("ERROR: Derived key not available");
        }
    }
    
    function getKeyClass(hashedKey: string, rawKeys: RawKeys): string {
        switch (hashedKey) {
            case rawKeys.key1?.hashed: return "key1";
            case rawKeys.key2?.hashed: return "key2";
            case rawKeys.key3?.hashed: return "key3";
            case rawKeys.key4?.hashed: return "key4";
            default: return "key1";
        }
    }

    useEffect(() => {
        let isMounted = true;

        const decryptMessage = async () => {
            try {
                const key = extractDerivedKey(derivedKeys, message.chatKey);
                const decryptedMessage = await decrypt(message.content, message.iv, key);
                const decryptedSender = await decrypt(message.sender, message.iv, key);

                if (isMounted) {
                    if (decryptedMessage.success && decryptedSender.success) {
                        setDecryptedContent(decryptedMessage.decrypted);
                        setDecryptedUsername(decryptedSender.decrypted);
                        setError(null);
                    } else {
                        setError(decryptedMessage.decrypted);
                        setDecryptedContent("");
                        setDecryptedUsername("");
                    }
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to decrypt message");
                    setDecryptedContent("");
                    setDecryptedUsername("");
                }
            }
        };

        decryptMessage();

        return () => {
            isMounted = false;
        };
    }, [message, derivedKeys]);

    return (
        <>
            <div className="my-2">
                <span className={`font-serif-bold ${getKeyClass(message.chatKey, rawKeys)}`}>
                    {decryptedUsername}:
                </span>
                <span className={`font-mono ${error ? "text-danger" : getKeyClass(message.chatKey, rawKeys)}`}>
                    {error ?
                        (" " + error) :
                        (" " + (decryptedContent || "Decrypting..."))
                    }
                </span>
            </div>
        </>
    );
}
