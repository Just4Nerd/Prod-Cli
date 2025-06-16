const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {validateUpdateCategory, validateCreateCategory} = require('../Middleware/categoryMiddleware')
const {getAllCategories, updateCategory, createCategory} = require('./categoryController')

router.get('/getAll', verifyBrokerToken, getAllCategories) //Route to get all categories
router.post('/:id/update', [verifyBrokerToken, validateUpdateCategory], updateCategory) //Route to update specific category by Id
router.post('/create', [verifyBrokerToken, validateCreateCategory], createCategory) // Route to create a new category

module.exports = router;