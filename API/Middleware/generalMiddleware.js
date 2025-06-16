const yup = require('yup');

// this validates if the request has a valid Id.
//  It is used when no body is passed and only id is in the parameters
async function validateId(req, res, next) {
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
    validateId
}