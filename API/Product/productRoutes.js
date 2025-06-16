const express = require('express');
const router = express.Router();
const {verifyClientToken, verifyBrokerToken} = require('../Middleware/authMiddleware')
const {getAllProducts, createProduct, updateProduct, deleteProduct, addFeature, deleteFeatures, getProduct, getFeatures, getProductUserView} = require('./productController')
const {validateCreateProduct, validateUpdateProduct, validateAddFeature, validateDelFeatures} = require('../Middleware/productMiddleware');
const {validateId} = require('../Middleware/generalMiddleware');

router.get('/getAll', verifyBrokerToken, getAllProducts) //Route to get all products
router.get('/:id/', [verifyBrokerToken, validateId], getProduct) //Route to get specific product by ID
router.get('/:id/features', [verifyBrokerToken, validateId], getFeatures) //Route to all features of specific product by ID
router.post('/create', [verifyBrokerToken, validateCreateProduct], createProduct) //Route to create a new product
router.post('/:id/update', [verifyBrokerToken, validateUpdateProduct], updateProduct) //Route to update a specific product by ID
router.delete('/:id/', [verifyBrokerToken, validateId], deleteProduct) //Route to delete a specific product by Id
router.post('/:id/feature/add', [verifyBrokerToken, validateAddFeature], addFeature) //Route to add feature to specific product by ID
router.delete('/features/delete', [verifyBrokerToken, validateDelFeatures], deleteFeatures) //Route to delete features
router.get('/:id/productview', [verifyBrokerToken, validateId], getProductUserView) //Route to get all product-user view information provided a specific product ID

module.exports = router;