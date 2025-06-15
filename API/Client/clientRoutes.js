const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getProducts} = require('./clientController')

router.get('/', verifyClientToken, getProducts)

module.exports = router;