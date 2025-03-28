import { useEffect, useState } from 'react'
import './Enchatt.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';
import { DerivedKeys, RawKeys } from '../../utils/keys';
import { deriveAesKey } from '../../utils/encryption';
import { TopBar } from '../TopBar/TopBar';
import { ChatBox } from '../ChatBox/ChatBox';
import { ChatSubmit } from '../ChatSubmit/ChatSubmit';



/**
 * Enchatt component represents the chat page
 *
 * @param {Object} props - props
 * @param {string} props.username - the username of the current user
 * @param {Function} props.navigateToLogin - function for navigation to Login component
 * @returns {JSX.Element} - the rendered chat interface
 */
function Enchatt({ username, navigateToLogin }: { username: string, navigateToLogin : () => void }) {
    
    const navigate = navigateToLogin;
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
        if (!username|| username.trim()==='') {
            navigate(); // redirect to login if username is empty
        }
    }, [username, navigate]); // run when username <changes></changes>

    return (
        <Container fluid="xxl" className="d-flex flex-column vh-100 px-3">
            <Row className="m-0">
                <Col className="p-0">
                    <TopBar navigateToLogin={navigateToLogin}/>
                </Col>
            </Row>

            {/* Scrollable middle section */}
            <Row className="flex-grow-1 overflow-hidden m-0">
                <Col md={10} className="h-100 mx-auto px-3">
                    <div className="h-100">
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

