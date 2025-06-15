const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getProductsGeneral, getProduct} = require('./clientController')
const {validateId} = require('../Middleware/generalMiddleware')

router.get('/:id/', [verifyClientToken, validateId], getProduct)
router.get('/', verifyClientToken, getProductsGeneral)


module.exports = router;