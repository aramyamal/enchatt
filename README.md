# **User Manual**

This guide explains how to install, run, and use **enchatt**.

## **Step-by-Step Guide to Install and Run enchatt**

### **I. Clone the Repository**

```sh
git clone <your-repo-url>
```

### **II. Setting up PostgreSQL 17**

1. Go to the official PostgreSQL website: [PostgreSQL Download Page](https://www.postgresql.org/download/)
2. Select your operating system and download PostgreSQL 17.
3. Run the installer and follow these setup instructions:

   - Set the port to **5432**.
   - Choose a password for the **Postgres** user (**you will need this later**).
   - Complete the installation process.

4. Navigate to the **root/server** directory:

   ```sh
   cd yourPath/Enchatt/server
   ```

5. Create a new file named `.env`:

   ```sh
   touch .env
   ```

6. Open `.env` and paste the following line:
   ```sh
   DB_URL='postgres://postgres:YOURPASSWORD@localhost:5432/enchatt_db'
   ```
   **Replace** `YOURPASSWORD` with the password you set during installation.

### **III. Manually Create Database**

1. Open your terminal and enter:

   ```sh
   psql -h localhost -U postgres
   ```

2. If successful, you should see the PostgreSQL prompt:

   ```sh
   postgres=#
   ```

3. Create a new database:

   ```sql
   CREATE DATABASE enchatt_db;
   ```

4. Confirm that the database was created:
   ```sql
   \l
   ```

### **IV. Start the Backend Server**

1. Open a terminal and navigate to the `server` directory:
   ```sh
   cd yourPath/Enchatt/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm run dev
   ```

### **V. Start the Frontend**

1. Open a new terminal and navigate to the `client` directory:
   ```sh
   cd yourPath/Enchatt/client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:

   ```sh
   npm run dev
   ```

4. Open your browser and enter:
   ```
   http://localhost:5173/
   ```

---

## **How to Use enchatt**

### **1. Login Page**

After following the setup guide, you should see the login page.

![enchatt login page](images/enchattLoginPage.png)

### **2. Enter a Username**

Type in a username.

![Username input](images/enchattUserOne.png)

### **3. Signed into enchatt**

Once logged in, you are redirected to the chat page.

![Chat page](images/enchattSignedIn.png)

### **4. Create or Join a Chat Room**

Type a chat key in the input boxes at the bottom of the page to create or join an existing chat room.

![Creating a new chat room](images/enchattNewChat.png)

### **5. Connected to the Chat Room**

The highlighted box confirms that you are connected to the chat room. You can now send messages.

![Message sent to new chat](images/enchattNewChatSentMessage.png)

### **6. Join an Existing Chat Room**

If you join an existing chat room, you will see the **entire chat history**, even from before you joined.

![Joining existing chat rooms](images/enchattOldChat.png)

### **7. Combine Multiple Chat Rooms**

You can have up to **four chat rooms active at the same time**, which are combined into one.

![Combining chat rooms](images/enchattCombiningChats.png)
