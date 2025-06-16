const express = require('express');
const router = express.Router();
const userRoutes = require('./User/userRoutes')
const productRoutes = require('./Product/productRoutes')
const categoryRoutes = require('./Category/categoryRoutes')
const clientRoutes = require('./Client/clientRoutes')
const userProd = require('./UserProductVisibility/userProductRoutes')

// This creates main routes
router.use('/user', userRoutes) //Everything user related
router.use('/product', productRoutes) //Everything product related
router.use('/category', categoryRoutes) //Everything category related
router.use('/userprod', userProd) //Everything that handles user-product visibility
router.use('/client', clientRoutes) //Everything that concerns the client

module.exports = router;