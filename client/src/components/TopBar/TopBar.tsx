import "bootstrap-icons/font/bootstrap-icons.css"
import { Logo } from "../Logo/Logo";
import { SignOut } from "../SignOut/SignOut";

/**
 * TopBar component displays the top bar
 * it includes a logo and a sign-out button
 *
 * @returns {JSX.Element} the rendered top bar component
 */
export function TopBar () {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <a className='fs-1 font-serif text-decoration-none text-body'><Logo/></a>
            <a className='fs-4 font-serif text-decoration-none text-body' href="/"><SignOut/> </a>
        </div>
    );
}
