import { Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./EncryptedInput.module.css"


/**
 * EncryptedInput component renders an input field with a scrambling placeholder effect
 *
 * @param {Object} props - props
 * @param {string} props.inputPlaceholder - the placeholder text displayed in the input field
 * @param {Function} props.handleInput - function triggered when the user presses "Enter" and updates state in paret component
 * @returns {JSX.Element}  - the rendered input component
 */
export function EncryptedInput(
    { inputPlaceholder, handleInput }: { inputPlaceholder: string, handleInput: (input: string) => void }
) {

    // state for storing user input
    const [inputValue, setInputValue] = useState("");

    // states for placeholder scrambling effect
    const [displayText, setDisplayText] = useState(inputPlaceholder);
    const [isScrambled, setIsScrambled] = useState(false);

    /**
     * scrambles the actual text by replacing characters with random letters
     *
     * @param {string} text - the actual text to scramble
     * @returns {string} - the scrambled text
     */
    const scrambleText = (text: string) => {
        return text
            .split("")
            .map((char) => (char === " " ? " " : String.fromCharCode(97 + Math.floor(Math.random() * 26))))
            .join("");
    };


    // use effect for how long the original text is displayed
    useEffect(() => {
        const interval = setInterval(() => {
            setIsScrambled((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // use effect for how long the scramble effect is on
    useEffect(() => {
        if (isScrambled) {
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

    /**
     * handles "Enter" key press to submit the input value
     *
     * @param {React.KeyboardEvent} e - the keyboard event
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleInput(inputValue)
        }
    };

    return (
        <>
            <div className={`${styles.bottomBorderClass} px-0 bg-transparent text-center`}>
                <InputGroup className={`${styles.noCaret} col-12 col-md-8 col-lg-6`}>
                    <Form.Control
                        className="border-0 bg-transparent text-center font-monospace shadow-none"
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                        placeholder={`${displayText}`}
                        value={inputValue}
                        onKeyDown={handleKeyDown}
                    />
                </InputGroup>
            </div>
        </>
    )
}
