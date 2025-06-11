const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getAllProducts, createProduct, updateProduct, deleteProduct, addFeature, deleteFeature} = require('./productController')
const {validateCreateProduct, validateUpdateProduct, validateAddFeature} = require('../Middleware/productMiddleware');
const {validateDelete} = require('../Middleware/generalMiddleware');

router.get('/getAll', verifyBrokerToken, getAllProducts)
router.post('/create', [verifyBrokerToken, validateCreateProduct], createProduct)
router.post('/:id/update', [verifyBrokerToken, validateUpdateProduct], updateProduct)
router.delete('/:id/', [verifyBrokerToken, validateDelete], deleteProduct)
router.post('/:id/feature/add', [verifyBrokerToken, validateAddFeature], addFeature)
router.delete('/feature/:id/', [verifyBrokerToken, validateDelete], deleteFeature)

module.exports = router;