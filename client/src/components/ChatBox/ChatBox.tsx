import classes from "./ChatBox.module.css";
import Card from "react-bootstrap/Card";

export const ChatBox: React.FC = () => {
    return (
        <>
            <Card>
                <Card.Body>
                    <span className="font-serif">SnackGremlin:</span> Just found out pizza rolls are a valid breakfast.
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <span className="font-serif">Mangokalsong:</span> I love pandas.
                </Card.Body>
            </Card>
        </>
    )
}
