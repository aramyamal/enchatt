import { useEffect, useState } from "react";
import "./EncryptedText.module.css"

interface EncryptedTextProps {
    text : string;
    encryptEffectTime : number;
    trueTextTime : number;
    fontSizeProp? : string;
}

/**
* Component for scramble (encrypt effect)
* Component can either be just to scramble some text or it can be used for user input
* @prop {string} text - true text to scramble
* @prop {number} encryptEffectTime - time for effect in milli seconds
* @prop {number} trueTextTime - time for text prop in milli seconds
* @prop {boolean} input - is component used for text or input
* @prop {function} handleInputFunction - function from parent component if input needs to be handled
* @prop {string} fontSizeProp - bootstrap fontSizeProp class
* @returns a <div> with props
*/
export function EncryptedText ({ text, 
                                 encryptEffectTime, 
                                 trueTextTime,
                                 fontSizeProp = "1.5rem"} : 
                                 EncryptedTextProps) {
    
    // constants for scramble effect
    const [displayText, setDisplayText] = useState(text);
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
        <div className={`border-0 bg-transparent text-center font-monospace`} style={{fontSize : fontSizeProp }}>
            {displayText}
        </div>
    )
}