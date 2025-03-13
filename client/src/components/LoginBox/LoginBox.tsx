import { EncryptedInput } from "../EncryptedInput/EncryptedInput"

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