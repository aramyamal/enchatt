import { useState } from 'react'
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

function Enchatt({ username }: { username: string }) {
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

    return (
        <Container fluid="xxl" className="d-flex flex-column min-vh-100">
            <TopBar />
            <Row className="flex-grow-1 d-flex align-items-end justify-content-center">
                <Col className=""></Col>

                <Col md={8} className="">
                    <div className="">
                        <ChatBox rawKeys={rawKeyValues} />
                    </div>
                    <div className="">
                        <ChatSubmit
                            updateDerivedKeys={updateDerivedKeys}
                            updateRawKeys={setRawKeyValues}
                            derivedKeys={derivedKeyValues}
                            username={username}
                        />
                    </div>
                </Col>

                <Col className=""></Col>
            </Row>
        </Container>
    );
}

export default Enchatt;

