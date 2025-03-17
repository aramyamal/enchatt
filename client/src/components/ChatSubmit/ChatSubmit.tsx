import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import { DerivedKeys, KeyString, RawKeyObject, RawKeys, convertToKeyString, getKeyClass } from "../../utils/keys";
import React from "react";
import { encrypt, hashKey } from "../../utils/encryption";
import socket from "../../utils/socket";
import styles from "./ChatSubmit.module.css"

/**
 * ChatSubmit component handles message input, encryption, and submission via WebSockets.
 *
 * @param {Object} props - props
 * @param {Function} props.updateDerivedKeys - function to update derived keys in the parent component
 * @param {Function} props.updateRawKeys - function to update raw keys in the parent component
 * @param {DerivedKeys} props.derivedKeys - the active encryption keys
 * @param {RawKeys} props.rawKeys - the raw keys used for encryption
 * @param {string} props.username - the username of the sender
 * @returns {JSX.Element} - the rendered component.
 */
export function ChatSubmit(
    { updateDerivedKeys,
        updateRawKeys,
        derivedKeys,
        rawKeys,
        username
    }: {
        updateDerivedKeys: (activeKeys: RawKeys) => void,
        updateRawKeys: (rawKeys: RawKeys) => void,
        derivedKeys: DerivedKeys,
        rawKeys: RawKeys,
        username: string
    },
) {


    const [selectedKey, setSelectedKey] = useState<string>("Key 1");
    const [newMessage, setNewMessage] = useState<string>("");
    const [keyValues, setKeyValues] = useState<Map<KeyString, string>>(new Map([
        ["Key 1", ""],
        ["Key 2", ""],
        ["Key 3", ""],
        ["Key 4", ""]
    ]));

    /**
    * handles changes to key values and updates the parent state
    *
    * @param {KeyString} keyName - the name of the key
    * @param {string} value - the new value of the key
    * @returns {Promise<void>} - a promise that resolves when the key is updated
    */
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

    /**
     * handles selection of a new encryption key
     *
     * @param {string | null} eventKey - the selected keys name
     */
    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedKey(eventKey);
        }
        return;
    };


    /**
     * retrieves the hashed key object from the raw keys based on a given key string.
     *
     * @param {KeyString} keyString - the selected key name
     * @returns {RawKeyObject | undefined} the corresponding raw key object
     */
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
            const encryptedData = await encrypt(username, content, aesKey);

            // emit the encrypted message via Socket.io
            socket.emit("sendMessage", {
                chatId: rawKey.hashed,
                sender: encryptedData.usernameCipher,
                message: encryptedData.messageCipher,
                iv: encryptedData.iv
            });

            // console log output for when a message is successfully sent via a socket
            console.log("Message sent via socket:", {
                chatId: rawKey.hashed,
                sender: encryptedData.usernameCipher,
                message: encryptedData.messageCipher,
                iv: encryptedData.iv
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
        <div className="p-2 bg-body-secondary rounded-bottom shadow-lg rounded-4 ">
            <InputGroup>
                <Form.Control
                    className={`bg-transparent my-2 
                                ${getKeyClass(selectedKey as KeyString)}
                                ${styles.customInput}
                        `}
                    onChange={(e) => { setNewMessage(e.target.value); }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Enter message for ${selectedKey}...`}
                    aria-label="Key select"
                    value={newMessage}
                />

                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className={`bg-transparent border-0 ${getKeyClass(selectedKey as KeyString)} `}>
                        {selectedKey}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {[...keyValues.keys()].map((key) => (
                            <>
                                <br className="visually-hidden"></br>
                                <Dropdown.Item className={`${getKeyClass(key as KeyString)}`} key={key} eventKey={key}>
                                    <span className="visually-hidden-focusable">Select{"\u00A0"}</span>{key}
                                </Dropdown.Item>
                            </>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <InputGroup className={`${styles.customInput}`}>
                {[1, 2, 3, 4].map((nr) => (
                    <React.Fragment key={nr}>
                        <Form.Control
                            className={`
                                ms-2
                                border-0
                                form-control-sm
                                rounded
                                ${getKeyClass(`Key ${nr}` as KeyString)}
                                ${styles.customInput}
                            `}
                            placeholder={`Key ${nr}`}
                            aria-label={`Key ${nr}`}
                            onChange={(e) => handleKeyChange(`Key ${nr}` as KeyString, e.currentTarget.value)}
                            value={keyValues.get(`Key ${nr}` as KeyString) || ""}
                        />
                        <InputGroup.Text
                            className={`me-2 border-0 bg-transparent ${getKeyClass(`Key ${nr}` as KeyString)} ${styles.customInput}`}
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
