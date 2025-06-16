const user_prod_model = require('../UserProductVisibility/userProductModel')
const prodcuts_model = require('../Product/productModel')

//Function to get a product and allowed fields if the user can see it 
async function getProduct(req, res) {
    try {
        const user_id = req.current_user_id
        const {id} = req.params
        // Get the specific user-product field
        const visibility = await user_prod_model.getUserProd(user_id, id)

        // If it exists that means the client is allowed to see the product
        if (visibility.length > 0) {
            let product = await prodcuts_model.getProduct(id)
            product = product[0]
            // Create the object to return
            let new_obj = {
                id: product.id,
                name: product.product_name,
                category: product.category_name,
                layout: product.layout_type
            }

            // If description, price or features are visible to user, return them
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

//Function to get all products the client can see
async function getProductsGeneral(req, res) {
    try {
        const user_id = req.current_user_id
        // Get all user-product visibility pairs to see which product_ids the client is able to see
        const user_prod_visibility = await user_prod_model.getUserProdByUserId(user_id)
        // Get all prodcuts to get product indormation
        const all_products = await prodcuts_model.getAllProducts()
        const productResults = []

        // Go through all user-product visibility pairs and find the necessary product information for each
        user_prod_visibility.forEach(visibility => {
            const product = all_products.find(prod => prod.id === visibility.product_id)
            if (!product) return; // skip if no product found

            // Create a new object with the necessary information and add it to the list to be later returned
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
