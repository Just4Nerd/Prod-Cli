const model = require('./categoryModel')

async function getAllCategories(req, res){
    try {
        const result = await model.getCategories()
        res.status(200).json({categories: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

module.exports = {
    getAllCategories
}