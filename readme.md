# "Medicine delivery app" project
## Starting the server

1. Clone the repository:
    git clone [https://github.com/IvanKondratiev/medicine-app.git]

Go to the server directory:
-  cd server
Install dependencies:
-  npm install
Restore the database from the dump:
-  mysql -u [user] -p[password] [database_name] < dump.sql
Set the environment variables:
specify the necessary environment variables in the .env file in server/src/database/data.env.

Start the server:
node server.js

Launching the client
Go to the client directory:
-  cd client
Install dependencies:
-  npm install
Start the client:
-  npm run dev
or
-  npm run start