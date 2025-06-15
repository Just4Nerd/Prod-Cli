const express = require('express');
const router = express.Router();
const userRoutes = require('./User/userRoutes')
const productRoutes = require('./Product/productRoutes')
const categoryRoutes = require('./Category/categoryRoutes')
const clientRoutes = require('./Client/clientRoutes')
const userProd = require('./UserProductVisibility/userProductRoutes')

router.use('/user', userRoutes)
router.use('/product', productRoutes)
router.use('/category', categoryRoutes)
router.use('/userprod', userProd)
router.use('/client', clientRoutes)

module.exports = router;