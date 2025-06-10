const express = require('express');
const router = express.Router();
const userRoutes = require('./User/userRoutes')

router.use('/user', userRoutes)

module.exports = router;