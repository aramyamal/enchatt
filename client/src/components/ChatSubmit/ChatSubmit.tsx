import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import { DerivedKeys, KeyString, RawKeyObject, RawKeys, convertToKeyString, getKeyClass } from "../../utils/keys";
import React from "react";
import { encrypt, hashKey } from "../../utils/encryption";
import socket from "../../utils/socket";

export function ChatSubmit(
    { updateDerivedKeys, updateRawKeys, derivedKeys, rawKeys, username }: { updateDerivedKeys: (activeKeys: RawKeys) => void, updateRawKeys: (rawKeys: RawKeys) => void, derivedKeys: DerivedKeys, rawKeys: RawKeys, username: string },
) {

    const [selectedKey, setSelectedKey] = useState<string>("Key 1");
    const [newMessage, setNewMessage] = useState<string>("");
    const [keyValues, setKeyValues] = useState<Map<KeyString, string>>(new Map([
        ["Key 1", ""],
        ["Key 2", ""],
        ["Key 3", ""],
        ["Key 4", ""]
    ]));

    const handleKeyChange = async (keyName: KeyString, value: string) => {
        const updatedKeyValues = new Map(keyValues);
        updatedKeyValues.set(keyName, value);
        setKeyValues(updatedKeyValues);

        // send updated keys to parent component in RawKeys format with salt
        const rawKeys: RawKeys = {};
        for (const [key, rawValue] of updatedKeyValues.entries()) {
            const trimmed: string = rawValue.trim();
            if (trimmed) {
                const keyId: keyof RawKeys = convertToKeyString(key);
                rawKeys[keyId] = { raw: trimmed, hashed: await hashKey(trimmed) };
            }
        }
        updateRawKeys(rawKeys);
        updateDerivedKeys(rawKeys);
    };

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedKey(eventKey);
        }
        return;
    };

    function getHashedFromKeyString(keyString: KeyString): RawKeyObject | undefined {
        switch (keyString) {
            case "Key 1": return rawKeys.key1; 
            case "Key 2": return rawKeys.key2;
            case "Key 3": return rawKeys.key3;
            case "Key 4": return rawKeys.key4; 
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const rawKey: RawKeyObject | undefined = 
                getHashedFromKeyString(selectedKey as KeyString);
            const derivedKey: CryptoKey | undefined =
                derivedKeys[convertToKeyString(selectedKey)];

            if (rawKey && derivedKey && newMessage.trim() != "") {
                sendMessage(newMessage, rawKey, derivedKey);
                setNewMessage("");
            }
        }
    };

    async function sendMessage(
        content: string,
        rawKey: RawKeyObject,
        aesKey: CryptoKey
    ) {
        try {
            const encrypted = await encrypt(content, aesKey);

            // emit the encrypted message via Socket.io
            socket.emit("sendMessage", {
                chatId: rawKey.hashed,
                sender: username,
                message: encrypted.ciphertext,
                iv: encrypted.iv
            });

            // console log output for when a message is successfully sent via a socket
            console.log("Message sent via socket:", {
                chatId: rawKey.hashed,
                sender: username,
                message: encrypted.ciphertext,
                iv: encrypted.iv
            });
        } catch (error) {
            console.error("Failed to send chat to key ", rawKey.raw, error);
        }
    }

    // Global keyboard event listener for key switching
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl+1, Ctrl+2, etc.
            if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault(); // Prevent default browser action
                const keyNumber = parseInt(e.key);
                const keyName = `Key ${keyNumber}`;
                setSelectedKey(keyName);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    return (
        <div className="p-2 bg-body-secondary rounded-bottom shadow-lg rounded-4">
            <InputGroup className="">
                <Form.Control
                    className={`border-0 bg-transparent my-2 
                                ${getKeyClass(selectedKey as KeyString)}
                        `}
                    onChange={(e) => { setNewMessage(e.target.value); }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Enter message for ${selectedKey}...`}
                    aria-label="Key select"
                    value={newMessage}
                />

                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className={`bg-transparent border-0 ${getKeyClass(selectedKey as KeyString)}`}>
                        {selectedKey}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {[...keyValues.keys()].map((key) => (
                            <Dropdown.Item className={`${getKeyClass(key as KeyString)}`} key={key} eventKey={key}>
                                {key}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <InputGroup>
                {[1, 2, 3, 4].map((nr) => (
                    <React.Fragment key={nr}>
                        <Form.Control
                            className={`
                                ms-2
                                border-0
                                form-control-sm
                                rounded
                                ${getKeyClass(`Key ${nr}` as KeyString)}
                            `}
                            placeholder={`Key ${nr}`}
                            aria-label={`Key ${nr}`}
                            onChange={(e) => handleKeyChange(`Key ${nr}` as KeyString, e.currentTarget.value)}
                            value={keyValues.get(`Key ${nr}` as KeyString) || ""}
                        />
                        <InputGroup.Text
                            className={`me-2 border-0 bg-transparent ${getKeyClass(`Key ${nr}` as KeyString)}`}
                        >
                            {keyValues.get(`Key ${nr}` as KeyString)?.trim() !== "" ? (
                                <i className="bi bi-square-fill"></i>
                            ) : (
                                <i className="bi bi-square"></i>
                            )}
                        </InputGroup.Text>
                    </React.Fragment>
                ))}
            </InputGroup>
        </div>
    );
}
