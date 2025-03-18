import { useEffect, useState } from "react";
import "./EncryptedText.module.css"

interface EncryptedTextProps {
    text : string;
    encryptEffectTime : number;
    trueTextTime : number;
    fontSizeProp? : string;
}

/**
* EncrytpedText component scrambles some text (encryption effect)
* 
* @param {Object} props - props
* @param {string} props.text - true text to scramble
* @param {number} props.encryptEffectTime - time for effect in milli seconds
* @param {number} props.trueTextTime - time for text prop in milli seconds
* @param {string} props.fontSizeProp - bootstrap fontSizeProp class
* @returns a <div> with props
*/
export function EncryptedText ({ text, 
                                 encryptEffectTime, 
                                 trueTextTime,
                                 fontSizeProp = "1.5rem"} : 
                                 EncryptedTextProps) {
    
    // states for scramble effect
    const [displayText, setDisplayText] = useState(text);
    const [isScrambled, setIsScrambled] = useState(false);

    /**
     * scrambles the given text by replacing characters with random letters
     *
     * @param {string} text - the actual text to scramble.
     * @returns {string} - the scrambled text.
     */
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
        }, trueTextTime);

        return () => clearInterval(interval);
    }, []);

    // use effect for how long the scramble effect is on
    useEffect(() => { 
        if (isScrambled){
            const scrambleInterval = setInterval(() => {
                setDisplayText(scrambleText(text));
            }, 75);
        
            setTimeout(() => {
            clearInterval(scrambleInterval);
            setDisplayText(text);
            }, encryptEffectTime);
        } else {
            setDisplayText(text);
        }
    }, [isScrambled]);
    
    return (
        <>
            <div className={`border-0 bg-transparent text-center font-monospace`} style={{fontSize : fontSizeProp }}>
                {displayText}
            </div>
        </>

    )
}