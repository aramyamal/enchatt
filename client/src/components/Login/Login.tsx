import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./Login.css"
import { useNavigate } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import { LoginBox } from "../LoginBox/LoginBox";


/**
 * Login component renders the login page
 * once a username is entered, the user is navigated to the chat page
 *
 * @param {Object} props - props
 * @param {Function} props.handleUsername - function to update the username in the parent component
 * @returns {JSX.Element} the rendered Login component
 */
export function Login({handleUsername} : {handleUsername: (username : string) => void}) {
    
    // hook for navigation
    const navigate = useNavigate();

    const handleUsernameInputFromLoginBox = (usernameInput : string) => {
        handleUsername(usernameInput)
        navigate("/enchatt")
    };

    return (
      <Container fluid="s" className="d-flex flex-column min-vh-100">

        <Row className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
          
          <Col md={10} className="d-flex flex-column align-items-center">
            <div className="login-logo" style={{ width: "100%", maxWidth: "500px" }}>
              <Logo />
            </div>
            <div style={{ width: "25%", maxWidth: "500px" }}>
              <LoginBox handleUsernameInput={handleUsernameInputFromLoginBox}/>
            </div>
          </Col>
  
        </Row>
        
      </Container>
    );
  }
  

export default Login;
