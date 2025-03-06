import { KeyString, Message, DerivedKeys, getKeyClass } from "../../api";
import { decrypt } from "../../encryption";
import { useEffect, useState } from "react";

export function MessageComponent({ message, derivedKeys }: { message: Message, derivedKeys: DerivedKeys }) {
    const [decryptedContent, setDecryptedContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    function extractDerivedKey(derivedKeys: DerivedKeys, keyString: KeyString): CryptoKey {
        let cryptoKey: CryptoKey | undefined;
        switch (keyString) {
            case "Key 1":
                cryptoKey = derivedKeys.key1;
                break;
            case "Key 2":
                cryptoKey = derivedKeys.key2;
                break;
            case "Key 3":
                cryptoKey = derivedKeys.key3;
                break;
            case "Key 4":
                cryptoKey = derivedKeys.key4;
                break;
        }
        if (cryptoKey) {
            return cryptoKey;
        } else {
            throw new Error("Error: Derived key not available");
        }
    }

    useEffect(() => {
        let isMounted = true;

        const decryptMessage = async () => {
            try {
                const key = extractDerivedKey(derivedKeys, message.key);
                const result = await decrypt(message.content, message.iv, key);

                if (isMounted) {
                    if (result.success) {
                        setDecryptedContent(result.message);
                        setError(null);
                    } else {
                        setError(result.message);
                        setDecryptedContent("");
                    }
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to decrypt message");
                    setDecryptedContent("");
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
                <span className={`font-serif-bold ${getKeyClass(message.key)}`}>
                    {message.sender}:
                </span>
                <span className={`font-mono ${error ? "text-danger" : getKeyClass(message.key)}`}>
                    {error ?
                        (" " + error) :
                        (" " + (decryptedContent || "Decrypting..."))
                    }
                </span>
            </div>
        </>
    );
}
