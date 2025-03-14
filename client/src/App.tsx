import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login/Login";
import Enchatt from "./components/Enchatt/Enchatt";

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
