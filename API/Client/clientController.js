const user_prod_model = require('../UserProductVisibility/userProductModel')
const prodcuts_model = require('../Product/productModel')

async function getProduct(req, res) {
    try {
        const user_id = req.current_user_id
        const {id} = req.params
        const visibility = await user_prod_model.getUserProd(user_id, id)

        if (visibility.length > 0) {
            let product = await prodcuts_model.getProduct(id)
            product = product[0]
            let new_obj = {
                id: product.id,
                name: product.product_name,
                category: product.category_name,
                layout: product.layout_type
            }

            if (visibility[0].show_description) {
                new_obj.description = product.description
            }
            if (visibility[0].show_price) {
                new_obj.price = product.price
            }
            if (visibility[0].show_features) {
                const features = await prodcuts_model.getFeatures(id)
                new_obj.features = features
            }
            res.status(200).json({ products: new_obj })
        } else {
            res.status(500).json({ error: 'Product not found' })
        }

        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

async function getProductsGeneral(req, res) {
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
                name: product.product_name,
                category: product.category_name,
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
    getProductsGeneral,
    getProduct
}
