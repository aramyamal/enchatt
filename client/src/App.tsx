import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Enchatt from "./Enchatt"; 
import { useState } from "react";

function App() {

    const [username, setUsername] = useState("")

    const handleUsernameFromLogin = (usernameInput : string ) => {
        setUsername(usernameInput)
    } 

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login handleUsername={handleUsernameFromLogin}/>} /> 
                <Route path="/enchatt" element={<Enchatt username={username}/>} />
            </Routes>
        </Router>
    );
}

export default App;
