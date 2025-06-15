const model = require('./productModel')
const user_model = require('../User/userModel')
const user_prod_model = require('../UserProductVisibility/userProductModel')

async function getAllProducts(req, res){
    try {
        const result = await model.getAllProducts()
        res.status(200).json({products: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function getFeatures(req, res){
    try {
        const {id} = req.params
        const result = await model.getFeatures(id)
        res.status(200).json({features: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function getProduct(req, res){
    try {
        const {id} = req.params
        const result = await model.getProduct(id)
        res.status(200).json({product: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function createProduct(req, res) {
    const { name, description, category_id, price } = req.body;
    try {
        const result = await model.createProduct(name, description, category_id, price)
        res.status(201).json({ message: 'Product created successfully', id: result.insertId});
    } catch(error) {
        res.status(500).json({Error: error})
    }
}
async function updateProduct(req, res) {
    const { name, description, category_id, price } = req.body;
    const {id} = req.params
    try {
        const result = await model.updateProduct(id, name, description, category_id, price)
        res.status(201).json({ message: 'Product updated successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function deleteProduct(req, res) {
    const {id} = req.params
    try {
        const result = await model.deleteProduct(id)
        res.status(200).json({ message: 'Product deleted successfully'});
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function addFeature(req, res) {
    const { features } = req.body;
    const {id} = req.params
    try {
        const result = await model.addFeature(id, features)
        res.status(200).json({ message: 'Feature added successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function deleteFeatures(req, res) {
    const { features } = req.body;
    try {
        const result = await model.deleteFeatures(features)
        res.status(200).json({ message: 'Features deleted successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function getProductUserView(req, res){
    try {
        const {id} = req.params
        const user_view = await user_prod_model.getUserProdByProdId(id)
        const all_users = await user_model.getUsers()
        const all_products = await model.getAllProducts()
        if (all_products.some(product => product.id == id)){
        
        // add all users to the user view so that they can be enabled in the future
            all_users.forEach(user => {
                if (!user_view.some(view => view.user_id == user.id)) {
                    user_view.push({id: -1, user_id: user.id, product_id: id, show_description: 0, show_price: 0, show_features: 0})
                }
            })
            user_view.forEach(view => {
                const user = all_users.find(user => user.id == view.user_id)
                view.login = user.login
            })
            res.status(200).json({prod_user_view: user_view})
        } else {
            res.status(500).json({Error: 'Product doesnt exist.'})
        }
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addFeature,
    deleteFeatures,
    getProduct, 
    getFeatures,
    getProductUserView
}