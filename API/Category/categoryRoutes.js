const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {validateUpdateCategory, validateCreateCategory} = require('../Middleware/categoryMiddleware')
const {getAllCategories, updateCategory, createCategory} = require('./categoryController')

router.get('/getAll', verifyBrokerToken, getAllCategories)
router.post('/:id/update', [verifyBrokerToken, validateUpdateCategory], updateCategory)
router.post('/create', [verifyBrokerToken, validateCreateCategory], createCategory)

module.exports = router;