import { useState } from 'react'
import './Enchatt.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';

import { ChatBox } from './components/ChatBox/ChatBox';
import { ChatSubmit } from './components/ChatSubmit/ChatSubmit';
import { TopBar } from "./components/TopBar/TopBar";

function Enchatt({username} : {username : string}) {
    const [keyValues, setKeyValues] = useState<string[]>([]);
    const handleKeyChange = (activeKeys : string[]) => {
        setKeyValues(activeKeys)
    };

    return (
        <Container fluid="xxl" className="d-flex flex-column min-vh-100">
            <TopBar />
            <Row className="flex-grow-1 d-flex align-items-end justify-content-center">
                <Col className=""></Col>

                <Col md={8} className="">
                    <div className="">
                        <ChatBox activeKeys = {keyValues}/>
                    </div>
                    <div className="">
                        <ChatSubmit onKeyChange= {handleKeyChange} username={username} />
                    </div>
                </Col>

                <Col className=""></Col>
            </Row>
        </Container>
    );
}

export default Enchatt;

