import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import { Message, createMessage } from "../../api";

export const ChatSubmit: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<string>("Key 1");
    const keyMap: Map<string, string> = new Map([
        ["testkey", "key1"],
        ["Key 2", "key2"],
        ["Key 3", "key3"],
        ["Key 4", "key4"]
    ]);

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedKey(eventKey);
        }
        return;
    };

    const [newMessage, setNewMessage] = useState<string>("");

    async function sendMessage(content: string, key: string) {
        try {
            createMessage("browser_user", content, key);
        } catch (error) {
            console.error("Failed to send chat to key ", key);
        }
    }

    return (
        <div className="">
            <InputGroup className="">
                <Form.Control onChange={(text) => {
                    setNewMessage(text.target.value);
                }}
                    onKeyDown={() => { sendMessage(newMessage, selectedKey) }}
                    placeholder={`Enter message for ${selectedKey}...`} aria-label="Key select" />


                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className="bg-transparent border-0">
                        {selectedKey}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={`
                        bg-transparent border-0 shadow-lg
                    `}>
                        {[...keyMap.keys()].map((name) => (
                            <Dropdown.Item
                                key={name}
                                eventKey={name}
                                data-value={keyMap.get(name)}
                            >
                                {name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

            </InputGroup>
            <InputGroup>
                <InputGroup.Text>⊛</InputGroup.Text>
                <Form.Control placeholder="Key 1" aria-label="Key 1" />

                <InputGroup.Text className="key2">⊛</InputGroup.Text>
                <Form.Control className="key2" placeholder="Key 2" aria-label="Key 2" />

                <InputGroup.Text className="key3">⊛</InputGroup.Text>
                <Form.Control className="key3" placeholder="Key 3" aria-label="Key 3" />

                <InputGroup.Text className="key4">⊛</InputGroup.Text>
                <Form.Control className="key4" placeholder="Key 4" aria-label="Key 4" />
            </InputGroup>
        </div>
    )
}
