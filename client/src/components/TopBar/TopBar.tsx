import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap-icons/font/bootstrap-icons.css"
import { Logo } from "../Logo/Logo";

export const TopBar: React.FC = () => {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <a className='fs-1 font-serif text-decoration-none text-body' href="/"><Logo/></a>
            <Dropdown align="end">
                <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                    <i className="fs-5 bi-person" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="text-center">
                    <Dropdown.Item href="/">Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
