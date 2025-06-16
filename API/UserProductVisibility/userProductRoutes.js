const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {validateAddUserProd, validateUpdateUserProd} = require('../Middleware/userProdMiddleware')
const {validateId} = require('../Middleware/generalMiddleware')
const {addUserProd, deleteUserProd, updateUserProd} = require('./userProductController')

router.post('/add', [verifyBrokerToken, validateAddUserProd], addUserProd) //Route to add a new user-product visibility entry
router.delete('/:id/', [verifyBrokerToken, validateId], deleteUserProd) //Route to delete a specific user-product visibility by ID
router.post('/:id/', [verifyBrokerToken, validateUpdateUserProd], updateUserProd) //Route to update a specific user-product visibility by ID

module.exports = router;