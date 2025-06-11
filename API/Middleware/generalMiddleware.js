const yup = require('yup');

async function validateDelete(req, res, next) {
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
    validateDelete
}