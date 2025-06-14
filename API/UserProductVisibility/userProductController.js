const model = require('./userProductModel')

async function addUserProd(req, res) {
    const { user_id, product_id, show_description, show_price, show_features } = req.body;
    try {
        const result = await model.addUserProd(user_id, product_id, show_description, show_price, show_features)
        res.status(200).json({ message: 'User Product Visibility added successfully', id: result.insertId});
    } catch(error) {
        res.status(500).json({Error: error})   
    }
}

async function deleteUserProd(req, res) {
    const {id} = req.params
    try {
        const result = await model.deleteUserProd(id)
        res.status(200).json({ message: 'User Product Visibility deleted successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function updateUserProd(req, res) {
    const {show_description, show_price, show_features } = req.body;
    const {id} = req.params
    try {
        const result = await model.updateUserProd(id, show_description, show_price, show_features)
        res.status(200).json({ message: 'User Product Visibility updated successfully'});
    } catch(error) {
        res.status(500).json({Error: error}) 
    }
}

module.exports = {
    addUserProd,
    deleteUserProd,
    updateUserProd
}