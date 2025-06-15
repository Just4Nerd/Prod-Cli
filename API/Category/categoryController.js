const model = require('./categoryModel')

async function getAllCategories(req, res){
    try {
        const result = await model.getCategories()
        res.status(200).json({categories: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

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

async function createCategory(req, res){
    try {
        const { name, layout_type } = req.body;
        const result = await model.createCategory(name, layout_type)
        console.log(result)
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