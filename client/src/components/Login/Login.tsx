import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";
import { Logo } from "../Logo/Logo";
import { LoginBox } from "../LoginBox/LoginBox";

/**
 * Login component renders the login page
 *
 * @param {Object} props - props
 * @param {Function} props.handleUsername - function to update the username in the parent component
 * @returns {JSX.Element} the rendered Login component
 */
export function Login({handleUsername} : {handleUsername: (username : string) => void}) {

    const handleUsernameInputFromLoginBox = (usernameInput: string) => {
        handleUsername(usernameInput);
    };

    return (
        <Container fluid="lg" className="d-flex flex-column min-vh-100">
            <Row className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                <Col md={10} className="d-flex flex-column align-items-center">
                    <div className="login-logo" style={{ width: "100%", maxWidth: "600px" }}>
                        <Logo />
                    </div>
                    <div style={{ width: "76%", maxWidth: "250px" }}>
                        <LoginBox handleUsernameInput={handleUsernameInputFromLoginBox} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
