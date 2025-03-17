import "./Logo.module.css"
import { EncryptedText } from "../EncryptedText/EncryptedText";


/**
 * Logo component displays the name of the application with an encryption effect
 *
 * @returns {JSX.Element} -  the rendered logo component
 */
export function Logo() {

    return (
        <div>
            <EncryptedText 
            text="enchatt" 
            encryptEffectTime={1200} 
            trueTextTime={2000} 
            fontSizeProp="3rem"/>
        </div>
    )
}