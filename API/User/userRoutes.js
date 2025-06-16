const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {createUser, loginUser, updateUser, getAllUsers, deleteUser, getUser, verifyBroker, getUserProductView} = require('./userController')
const {validateCreateUser, validateLoginUser, validateUpdateUser, validateBrokerCode} = require('../Middleware/userMiddleware')
const {validateId} = require('../Middleware/generalMiddleware')

router.post('/register', validateCreateUser, createUser) //Route to create a new user (register)
router.post('/login', validateLoginUser, loginUser) //Route to validate the user (login)
router.post('/:id/update', [verifyBrokerToken, validateUpdateUser], updateUser) //Route to update specific user by ID
router.post('/verifybroker', [verifyBrokerToken, validateBrokerCode], verifyBroker) //Route to verify broker code
router.get('/getAll', verifyBrokerToken, getAllUsers) //Route to get all clients
router.get('/:id/', [verifyBrokerToken, validateId], getUser) //Route to get specific client information
router.get('/:id/productview', [verifyBrokerToken, validateId], getUserProductView) //Route to get user-product view for specific user
router.delete('/:id/', [verifyBrokerToken, validateId], deleteUser) //Route to delete specific user by ID


module.exports = router;