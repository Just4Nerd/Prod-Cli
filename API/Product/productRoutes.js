const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getAllProducts, createProduct, updateProduct, deleteProduct, addFeature, deleteFeatures, getProduct, getFeatures} = require('./productController')
const {validateCreateProduct, validateUpdateProduct, validateAddFeature, validateGetProduct, validateDelFeatures} = require('../Middleware/productMiddleware');
const {validateDelete} = require('../Middleware/generalMiddleware');

router.get('/getAll', verifyBrokerToken, getAllProducts)
router.get('/:id/', validateGetProduct, getProduct)
router.get('/:id/features', validateGetProduct, getFeatures)
router.post('/create', [verifyBrokerToken, validateCreateProduct], createProduct)
router.post('/:id/update', [verifyBrokerToken, validateUpdateProduct], updateProduct)
router.delete('/:id/', [verifyBrokerToken, validateDelete], deleteProduct)
router.post('/:id/feature/add', [verifyBrokerToken, validateAddFeature], addFeature)
router.delete('/features/delete', [verifyBrokerToken, validateDelFeatures], deleteFeatures)

module.exports = router;