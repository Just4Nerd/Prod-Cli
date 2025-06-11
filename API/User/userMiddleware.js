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

let roleChangeSchema = yup.object().shape({
    new_role: yup.number().required().positive().integer(),
    user_id: yup.number().required().positive().integer(),
});

async function validateCreateUser(req, res, next) {
    try {
        req.body = await createUserSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

async function validateLoginUser(req, res, next) {
    try {
        req.body = await loginUserSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }

}

async function validateRoleChange(req, res, next) {
    try {
        req.body = await roleChangeSchema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

module.exports = {validateCreateUser, validateLoginUser, validateRoleChange};

