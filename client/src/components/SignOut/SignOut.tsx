import { ButtonGroup } from "react-bootstrap"
import { EncryptedText } from "../EncryptedText/EncryptedText"
import styles from "./SignOut.module.css"


/**
 * SignOut component renders a sign-out button with an encryption effect
 * 
 * @returns {JSX.Element} the rendered sign-out button
 */
export function SignOut () {

    return (
        <ButtonGroup className={`${styles.signoutButton}`}>
            <EncryptedText 
                text="sign out" 
                encryptEffectTime={2000} 
                trueTextTime={3200} 
                fontSizeProp="1rem">
            </EncryptedText>
        </ButtonGroup>
    )
}