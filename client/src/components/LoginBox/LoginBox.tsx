import { Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./LoginBox.module.css"

export function LoginBox( 
    {handleUsernameInput} : {handleUsernameInput : (usernameInput : string) => void}
) {

    // constant for input or plain text
    const [inputValue, setInputValue] = useState("")
    
    // constants for scramble effect
    const [displayText, setDisplayText] = useState("type your username here");
    const [isScrambled, setIsScrambled] = useState(false);

    // function that scrambles text
    const scrambleText = (text: string) => {
        return text
            .split("")
            .map((char) => (char === " " ? " " : String.fromCharCode(97 + Math.floor(Math.random() * 26))))
            .join("");
    };
    

    // use effect for how long the original text is displayed
    useEffect(() => {
        const interval = setInterval(() =>{
            setIsScrambled((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // use effect for how long the scramble effect is on
    useEffect(() => { 
        if (isScrambled){
            const scrambleInterval = setInterval(() => {
                setDisplayText(scrambleText(displayText));
            }, 75);
        
            setTimeout(() => {
            clearInterval(scrambleInterval);
            setDisplayText("type your username here");
            }, 1200);
        } else {
            setDisplayText("type your username here");
        }
    }, [isScrambled]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUsernameInput(inputValue)
        }
    };

    return (
        <>
            <div className={`${styles.bottomBorderClass} bg-transparent text-center`} style={{ width: "100%", maxWidth: "500px" }}>
            <InputGroup className={`${styles.noCaret}`}>
                <Form.Control
                    className="border-0 bg-transparent text-center font-monospace shadow-none"
                    onChange={(e) => {
                        setInputValue(e.target.value)}}
                    placeholder={`${displayText}`}
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                />
            </InputGroup>
            </div>
        </>
    )
}