import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login/Login";
import Enchatt from "./components/Enchatt/Enchatt";

/**
 * main App component with Router
 * 
 */
function App() {
    const [username, setUsername] = useState("");

    return (
        <Router>
            <AppWrapper username={username} setUsername={setUsername} />
        </Router>
    );
}

/**
 * wrapper component to handle navigation and routes
 */
function AppWrapper({ username, setUsername }: { username: string; setUsername: (username: string) => void }) {
    const navigate = useNavigate();

    const handleUsernameFromLogin = (usernameInput: string) => {
        setUsername(usernameInput);
        navigate("/enchatt");
    };

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

