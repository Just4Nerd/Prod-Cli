const yup = require('yup');

let createProductSchema = yup.object().shape({
    name: yup.string().required(),
    category_id: yup.number().positive().integer().required(),
    description: yup.string().required(),
    price: yup.number().positive().required()
});

let addFeatureSchema = yup.object().shape({
    features: yup.array().of(yup.string().required()).required().min(1)
});

let delFeaturesSchema = yup.object().shape({
    features: yup.array().of(yup.number().required()).required().min(1)
});

let updateProductSchema = yup.object().shape({
    name: yup.string(),
    category_id: yup.number().positive().integer(),
    description: yup.string(),
    price: yup.number().positive()
});

async function validateCreateProduct(req, res, next) {
    try {
        req.body = await createProductSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

async function validateUpdateProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        req.body = await updateProductSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

// async function validateDeleteProduct(req, res, next) {
//     try {
//         const id = req.params.id;
//         if (!id || isNaN(Number(id))) {
//             return res.status(400).json({ error: 'Invalid or missing user ID' });
//         }
//         next();
//     } catch (err) {
//         res.status(400).json({error: err.message});
//     }
// }

async function validateAddFeature(req, res, next) {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        req.body = await addFeatureSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

async function validateDelFeatures(req, res, next) {
    try {
        console.log("here")
        req.body = await delFeaturesSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

async function validateGetProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

module.exports = {
    validateCreateProduct, 
    validateUpdateProduct, 
    validateAddFeature,
    validateGetProduct,
    validateDelFeatures
};