const yup = require('yup');

let userProdAddSchema = yup.object().shape({
    user_id: yup.number().required().positive().integer(),
    product_id: yup.number().required().positive().integer(),
    show_description: yup.bool().required(),
    show_price: yup.bool().required(),
    show_features: yup.bool().required(),
});

let userProdUpdateSchema = yup.object().shape({
    show_description: yup.bool().required(),
    show_price: yup.bool().required(),
    show_features: yup.bool().required(),
});

async function validateAddUserProd(req, res, next) {
    try {
        req.body = await userProdAddSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

async function validateUpdateUserProd(req, res, next) {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        req.body = await userProdUpdateSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}


module.exports = {
    validateAddUserProd,
    validateUpdateUserProd
}