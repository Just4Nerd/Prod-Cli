const model = require('./categoryModel')

//Function to get All categories
async function getAllCategories(req, res){
    try {
        const result = await model.getCategories()
        res.status(200).json({categories: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

//Function to update category by ID
async function updateCategory(req, res){
    try {
        const { name, layout_type } = req.body;
        const {id} = req.params
        const result = await model.updateCategory(id, name, layout_type)
        res.status(200).json({message: 'Success'})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

//Function to create a new category
async function createCategory(req, res){
    try {
        const { name, layout_type } = req.body;
        const result = await model.createCategory(name, layout_type)
        res.status(200).json({message: 'Success', id: result.insertId})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

module.exports = {
    getAllCategories,
    updateCategory,
    createCategory
}