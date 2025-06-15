const model = require('./clientModel')
const user_prod_model = require('../UserProductVisibility/userProductModel')
const prodcuts_model = require('../Product/productModel')

async function getProducts(req, res) {
    try {
        const user_id = req.current_user_id
        const user_prod_visibility = await user_prod_model.getUserProdByUserId(user_id)
        const all_products = await prodcuts_model.getAllProducts()
        const all_features = await prodcuts_model.getAllFeatures()

        const productResults = []

        user_prod_visibility.forEach(visibility => {
            const product = all_products.find(prod => prod.id === visibility.product_id)
            if (!product) return; // skip if no product found

            const new_obj = {
                id: product.id,
                name: product.product_name
            }

            if (visibility.show_description) {
                new_obj.description = product.description
            }
            if (visibility.show_price) {
                new_obj.price = product.price
            }
            if (visibility.show_features) {
                const features = all_features.filter(feature => feature.product_id === product.id)
                new_obj.features = features
            }

            productResults.push(new_obj)
        })

        res.status(200).json({ products: productResults })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getProducts
}
