import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./Login.css"
import { LoginBox } from "./components/LoginBox/LoginBox";
import { Logo } from "./components/Logo/Logo";
import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("")

    const handleUsernameInput = (usernameInput : string) => {
        setUsername(usernameInput)
        
    };

    return (
      <Container fluid="xxl" className="d-flex flex-column min-vh-100">

        <Row className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
          
          <Col md={10} className="d-flex flex-column align-items-center">
            <div className="login-logo" style={{ width: "100%", maxWidth: "500px" }}>
              <Logo />
            </div>
            <div style={{ width: "25%", maxWidth: "500px" }}>
              <LoginBox handleUsernameInput={handleUsernameInput}/>
            </div>
          </Col>
  
        </Row>
        
      </Container>
    );
  }
  

export default Login;
