const model = require('./productModel')

async function getAllProducts(req, res){
    try {
        console.log(1)
        const result = await model.getAllProducts()
        res.status(200).json({users: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function createProduct(req, res) {
    const { name, description, category_id, price } = req.body;
    try {
        const result = await model.createProduct(name, description, category_id, price)
        res.status(201).json({ message: 'Product created successfully' });
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
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function addFeature(req, res) {
    const { content } = req.body;
    const {id} = req.params
    try {
        const result = await model.addFeature(id, content)
        res.status(200).json({ message: 'Feature added successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

async function deleteFeature(req, res) {
    const {id} = req.params
    try {
        const result = await model.deleteFeature(id)
        res.status(200).json({ message: 'Feature deleted successfully' });
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
    deleteFeature
}