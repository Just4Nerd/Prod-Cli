const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {createUser, loginUser, updateUser, getAllUsers, deleteUser, getUser, verifyBroker} = require('./userController')
const {validateCreateUser, validateLoginUser, validateUpdateUser, validateBrokerCode} = require('../Middleware/userMiddleware')
const {validateId} = require('../Middleware/generalMiddleware')

router.post('/register', validateCreateUser, createUser),
router.post('/login', validateLoginUser, loginUser)
router.post('/:id/update', [verifyBrokerToken, validateUpdateUser], updateUser)
router.post('/verifybroker', [verifyBrokerToken, validateBrokerCode], verifyBroker)
router.get('/getAll', verifyBrokerToken, getAllUsers)
router.get('/:id/', [verifyBrokerToken, validateId], getUser)
router.delete('/:id/', [verifyBrokerToken, validateId], deleteUser)


module.exports = router;