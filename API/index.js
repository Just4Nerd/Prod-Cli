require('dotenv').config();
const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});