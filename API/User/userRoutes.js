const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {createUser, loginUser, updateUser, getAllUsers, deleteUser} = require('./userController')
const {validateCreateUser, validateLoginUser, validateUpdateUser} = require('../Middleware/userMiddleware')
const {validateDelete} = require('../Middleware/generalMiddleware')

router.post('/register', validateCreateUser, createUser),
router.post('/login', validateLoginUser, loginUser)
router.post('/:id/update', [verifyBrokerToken, validateUpdateUser], updateUser)
router.get('/getAll', verifyBrokerToken, getAllUsers)
router.delete('/:id/', [verifyBrokerToken, validateDelete], deleteUser)


module.exports = router;