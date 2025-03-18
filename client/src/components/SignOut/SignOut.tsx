import { ButtonGroup } from "react-bootstrap"
import { EncryptedText } from "../EncryptedText/EncryptedText"
import styles from "./SignOut.module.css"


/**
 * SignOut component renders a sign-out button with an encryption effect
 * 
 * @param {Object} props - props
 * @param {Function} props.navigateToLoginFromTopBar - function for navigation back to Login component
 * @returns {JSX.Element} the rendered sign-out button
 */
export function SignOut ({ navigateToLoginFromTopBar} : { navigateToLoginFromTopBar : () => void }) {

    const navigateToLogin = navigateToLoginFromTopBar;

    return (
        <ButtonGroup className={`${styles.signoutButton}`}
                        onClick={navigateToLogin}>
            <EncryptedText 
                text="sign out" 
                encryptEffectTime={2000} 
                trueTextTime={3200} 
                fontSizeProp="1rem">
            </EncryptedText>
        </ButtonGroup>
    )
}