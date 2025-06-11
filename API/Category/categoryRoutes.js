const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getAllCategories} = require('./categoryController')

router.get('/getAll', verifyBrokerToken, getAllCategories)

module.exports = router;