import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/esm/Button";

export const ChatSubmit: React.FC = () => {
    return (
        <div className="">
            <InputGroup className="">
                <Form.Control aria-label="Key select" />

                <DropdownButton
                    variant="outline-secondary"
                    title="Dropdown"
                    id="input-group-dropdown-2"
                    align="end"
                >
                    <Dropdown.Item href="#">Key 1</Dropdown.Item>
                    <Dropdown.Item href="#">Key 2</Dropdown.Item>
                    <Dropdown.Item href="#">Key 3</Dropdown.Item>
                    <Dropdown.Item href="#">Key 4</Dropdown.Item>
                </DropdownButton>
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
                <Button variant="" onClick={() => { loadChats("testkey"); }}>
                    test
                </Button>
            </InputGroup>
        </div>
    )
}
