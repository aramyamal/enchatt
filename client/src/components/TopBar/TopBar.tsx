import "bootstrap-icons/font/bootstrap-icons.css"
import { Logo } from "../Logo/Logo";
import { SignOut } from "../SignOut/SignOut";

export function TopBar () {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <a className='fs-1 font-serif text-decoration-none text-body'><Logo/></a>
            <a className='fs-4 font-serif text-decoration-none text-body' href="/"><SignOut/> </a>
        </div>
    );
}
