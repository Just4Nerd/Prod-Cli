const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getProductsGeneral, getProduct} = require('./clientController')
const {validateId} = require('../Middleware/generalMiddleware')

router.get('/:id/', [verifyClientToken, validateId], getProduct) //Route to get the product and allowed fields for a client by product id
router.get('/', verifyClientToken, getProductsGeneral) //Route to get all products the client can see


module.exports = router;