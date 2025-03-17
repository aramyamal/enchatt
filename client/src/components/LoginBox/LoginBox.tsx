import { EncryptedInput } from "../EncryptedInput/EncryptedInput"



/**
 * LoginBox component renders an input field for the user to enter a username
 * the input field uses an encryption effect
 *
 * @param {Object} props - props
 * @param {Function} props.handleUsernameInput - function to update the username in parent component
 * @returns {JSX.Element} The rendered LoginBox component.
 */
export function LoginBox( 
    {handleUsernameInput} : {handleUsernameInput : (usernameInput : string) => void}
) {

    return (
        <>
            <div>
                <EncryptedInput
                    inputPlaceholder="type your username here"
                    handleInput={handleUsernameInput}>
                </EncryptedInput>
            </div>
        </>
    )
}