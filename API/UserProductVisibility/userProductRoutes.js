const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {validateAddUserProd, validateUpdateUserProd} = require('../Middleware/userProdMiddleware')
const {validateId} = require('../Middleware/generalMiddleware')
const {addUserProd, deleteUserProd, updateUserProd} = require('./userProductController')

// router.get('/getAll', verifyBrokerToken, getAllCategories)
router.post('/add', [verifyBrokerToken, validateAddUserProd], addUserProd)
router.delete('/:id/', [verifyBrokerToken, validateId], deleteUserProd)
router.post('/:id/', [verifyBrokerToken, validateUpdateUserProd], updateUserProd)

module.exports = router;