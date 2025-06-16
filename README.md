This project has 2 parts:
- Broker which creates and manages users, creates and manages products and it's categories, as well as which products which users see.
- Clients who can create an account and see the products which are enabled for them.
Products have price, description and feature fields which can also be enabled/disabled for specific users to see by Brokers.

How to install:
1) Clone the repository to have the code locally.
2) In root (/prod-cli) create a file .env where you will store local sensitive data. It should have DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, API_PORT, JWT_SECRET, BROKER_SECRET. You can copy everything from example.env and modify the fields;
3) Make sure you have node.js, npm and next.js installed. Node: https://nodejs.org/en; npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm; next.js: 'npm i next@latest react@latest react-dom@latest';
4) Install node.js dependencies by runing 'npm install' in root.
5) Install next.js dependencies by runing 'npm install' in /prod-cli/app/.
6) Setup MySql DB. I suggest to install MySql Workbench and MySql server: https://dev.mysql.com/downloads/installer/. Copy schema.sql content and run it as an sql script to create the necessary tables. Enter the credentials in the .env file.
7) To start the application run 'npm run start' in root (/prod-cli) and 'npm run dev' in /prod-cli/app/.
8) The app will start on localhost:3000.
9) To start create a new client account and in the database in the users table change it's role to role_id=2, so that the system sees the user as a broker.
