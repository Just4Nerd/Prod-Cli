const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Auth/authMiddleware')
const {createUser, loginUser, changeRole} = require('./userController')
const {validateCreateUser, validateLoginUser, validateRoleChange} = require('./userMiddleware')

router.post('/register', validateCreateUser, createUser),
router.post('/login', validateLoginUser, loginUser)
router.post('/role', [verifyBrokerToken, validateRoleChange], changeRole)

module.exports = router;