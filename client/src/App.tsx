import { useState } from 'react'
import './App.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import 'bootstrap/dist/css/bootstrap.min.css';

import { ChatBox } from './components/ChatBox/ChatBox';
import { ChatSubmit } from './components/ChatSubmit/ChatSubmit';
import { TopBar } from "./components/TopBar/TopBar";

function App() {
    const [key1Value, setKey1Value] = useState("");

    const handleKeyChange = (keyName: string, value: string) => {
        if (keyName === "Key 1") {
            setKey1Value(value);
        }
    };

    return (
        <Container fluid="xxl" className="d-flex flex-column min-vh-100">
            <TopBar />
            <Row className="flex-grow-1 d-flex align-items-end justify-content-center">
                <Col className=""></Col>

                <Col md={6} className="">
                    <div className="">
                        <ChatBox activeKey = {key1Value}/>
                    </div>
                    <div className="">
                        <ChatSubmit onKeyChange= {handleKeyChange} />
                    </div>
                </Col>

                <Col className=""></Col>
            </Row>
        </Container>
    );
}

export default App;

