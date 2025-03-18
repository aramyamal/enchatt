# enchatt

##About enchatt
-enchatt is an end to end encrypted web application for real time communication between users. Our application frontend uses hashing of room keys and password derivation algorithms to generate safe keys that are used to encrypt messages sent via web sockets to the backend.
As avid believers in the individuals right to privacy, we would like for the maintainersof enchatt to be aligned with our vision.

----

##User Manual
- Clone the repo
- Setting up PostgreSQL 17 for the application:
    i Go to the official PostgreSQL website: PostgreSQL Download Page
    ii Select your operation system and download PostgreSQL17
    iii Run the installer and follow these setup instructions:
        i Set the port to 5432
        ii Choose a password for the Postgres user(you will need this later)
        iii Complete the installation proecess
    iv Navigate to root/server
        i Create a new file named .env
        ii Open .env and paste the following line:
        iii DB_URL=’postgres://postgres:YOURPASSWORD@localhost:5432/enchatt_db’
    iv Replace YOURPASSWORD with the password you set during installation
    v Now Create database manually by following these steps:
        i Open your terminal and enter:
            psql -h localhost -U postgres
        ii If successful, you should see the PostgreSQL prompt:
            postgres=#
        iii Create a new database with:
            CREATE DATABASE enchatt_db;
        iv To confirm that the database has been created, type:
            \l
    vi You are ready to use PostgreSQL17
-Open a terminal and change directory to /yourPath/Enchatt/server, then run the commands:
    i npm install
    ii npm run dev
-IV Open a new terminal and change directory to /yourPath/Enchatt/client, then run the commands:
    i npm install
    ii npm run dev
    V Open your browser and type in the URL: http://localhost:5173/
