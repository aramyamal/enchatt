import { useEffect, useState } from 'react'
import './Enchatt.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';

import { ChatBox } from './components/ChatBox/ChatBox';
import { ChatSubmit } from './components/ChatSubmit/ChatSubmit';
import { TopBar } from "./components/TopBar/TopBar";
import { DerivedKeys, RawKeys } from './api';
import { deriveAesKey } from './encryption';
import { useNavigate } from 'react-router-dom';

function Enchatt({ username }: { username: string }) {
    const navigate = useNavigate();
    const [derivedKeyValues, setDerivedKeyValues] = useState<DerivedKeys>({});
    const [rawKeyValues, setRawKeyValues] = useState<RawKeys>({});

    const updateDerivedKeys = async (rawKeys: RawKeys) => {
        const derivedKeys: DerivedKeys = {};

        for (const [keyId, rawKeyObject] of Object.entries(rawKeys)) {
            derivedKeys[keyId as keyof DerivedKeys] =
                await deriveAesKey(rawKeyObject.raw, rawKeyObject.salt);
        }

        setDerivedKeyValues(derivedKeys);
    };

    useEffect(() => {
        if (!username) {
            navigate("/"); // Redirect to login if username is empty
        }
    }, [username, navigate]); // Run when username <changes></changes>

    return (
        <Container fluid="xxl" className="d-flex flex-column vh-100 px-3">
            <Row className="m-0">
                <Col className="p-0">
                    <TopBar />
                </Col>
            </Row>

            {/* Scrollable middle section */}
            <Row className="flex-grow-1 overflow-hidden m-0">
                <Col md={10} className="h-100 mx-auto px-3">
                    <div className="h-100 overflow-auto">
                        <ChatBox
                            rawKeys={rawKeyValues}
                            derivedKeys={derivedKeyValues}
                        />
                    </div>
                </Col>
            </Row>

            <Row className="m-0">
                <Col md={10} className="mx-auto p-0">
                    <ChatSubmit
                        updateDerivedKeys={updateDerivedKeys}
                        updateRawKeys={setRawKeyValues}
                        derivedKeys={derivedKeyValues}
                        rawKeys={rawKeyValues}
                        username={username}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Enchatt;

