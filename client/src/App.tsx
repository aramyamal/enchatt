import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login/Login";
import Enchatt from "./components/Enchatt/Enchatt";

/**
 * main App component with Router
 * handles the global username
 * 
 * @returns {JSX.Element} - The rendered App component.
 */
function App() {
    // state for handling username
    const [username, setUsername] = useState("");

    return (
        <Router>
            <AppWrapper username={username} setUsername={setUsername} />
        </Router>
    );
}

/**
 * wrapper component to handle navigation and routes
 * 
 * @param {Object} props - props
 * @param {string}} props.username - username passed down from App, to be used in Enchatt
 * @param {Function} props.handleUsernameInput - function to update the username in parent component
 * @returns {JSX.Element} - the rendered LoginBox component.
 */
function AppWrapper({ username, setUsername }: { username: string; setUsername: (username: string) => void }) {
    const navigate = useNavigate();

    /**
     * andles username input from the Login component
     * sets the username state and navigates to the chat
     *
     * @param {string} usernameInput - the username entered by the user
     */
    const handleUsernameFromLogin = (usernameInput: string) => {
        setUsername(usernameInput);
        navigate("/enchatt");
    };


    /**
     * handles user sign-out or missing username scenario
     * reroutes to Login component
     */
    const handleSigningOut = () => {
        navigate("/");
    };

    return (
        <Routes>
            <Route path="/" element={<Login handleUsername={handleUsernameFromLogin} />} />
            <Route path="/enchatt" element={<Enchatt username={username} navigateToLogin={handleSigningOut} />} />
        </Routes>
    );
}

export default App;

