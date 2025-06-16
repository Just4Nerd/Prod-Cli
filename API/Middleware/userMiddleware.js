const yup = require('yup');

const password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

let createUserSchema = yup.object().shape({
    login: yup.string().required(),
    password: yup.string().required().matches(password_regex),
});

let loginUserSchema = yup.object().shape({
    login: yup.string().required(),
    password: yup.string().required(),
});

let userUpdateSchema = yup.object().shape({
    login: yup.string().notRequired(),
    password: yup.string().matches(password_regex).notRequired(),
});

let verifyBrokerCodeSchema = yup.object().shape({
    broker_code: yup.string().required()
});

// handles create user; varifies if it has login and password that matches regex
async function validateCreateUser(req, res, next) {
    try {
        req.body = await createUserSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

// handles login user; varifies if it has login and password
async function validateLoginUser(req, res, next) {
    try {
        req.body = await loginUserSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }

}

// handles update user; varifies if it has login and password that matches regex as well as a valid ID
async function validateUpdateUser(req, res, next) {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        req.body = await userUpdateSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

// handles broker code verification; varifies if it has broker code field
async function validateBrokerCode(req, res, next) {
    try {
        req.body = await verifyBrokerCodeSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

module.exports = {validateCreateUser, validateLoginUser, validateUpdateUser, validateBrokerCode};

