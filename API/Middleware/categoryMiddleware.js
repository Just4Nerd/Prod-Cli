const yup = require('yup');

let categorySchema = yup.object().shape({
    name: yup.string().required(),
    layout_type: yup.string().required(),
});

async function validateUpdateCategory(req, res, next) {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        req.body = await categorySchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

async function validateCreateCategory(req, res, next) {
    try {
        req.body = await categorySchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

module.exports = {
    validateCreateCategory,
    validateUpdateCategory
};