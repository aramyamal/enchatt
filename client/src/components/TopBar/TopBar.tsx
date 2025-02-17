import classes from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap-icons/font/bootstrap-icons.css"

export const TopBar: React.FC = () => {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <a className='fs-1 font-serif text-decoration-none text-body' href="/">enchatt</a>
            <Dropdown align="end">
                <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                    <i className="fs-5 bi-person" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="text-center">
                    <Dropdown.Item href="/login">Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
