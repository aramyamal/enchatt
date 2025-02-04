# enchatt

## Use-cases
- Send key and recieve associated chat back
    1. The user starts the app
    2. The browser sends a request to the server with a certain key
    3. The server responds and sends the chat log associated with that key
    4. The browser displays the chat to the user
___

- Send message to chat associated with certain key
    1. The user starts the app
    2. The browser sends a request to the server with a certain key
    3. The server responds and sends the chat log associated with that key
    4. The browser displays the chat to the user
    5. The user types a message
    6. The user selects a key
    7. The browser sends a request containing the message and key to the server
    8. The server sends back a response saying the request succeeded
    9. The browser sends a request for the updated chat
    10. The server sends back the new chat log
    11. The browser displays the new chat log
