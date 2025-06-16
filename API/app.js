const express = require('express')

// This is the root of the API
const app = express()
const router = require('./router');
const cors = require('cors');

app.use(express.json())
app.use(cors());

app.use('/', router);

module.exports = app