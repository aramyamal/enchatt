import "./Logo.module.css"
import { EncryptedText } from "../EncryptedInput/EncryptedText";



export function Logo() {

    return (
        <div>
            <EncryptedText text="enchatt" encryptEffectTime={1200} trueTextTime={2000} fontSizeProp="3rem"/>
        </div>
    )
}