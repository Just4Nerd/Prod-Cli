const model = require('./userModel')
require('dotenv').config();

async function createUser(req, res) {
    const { login, password } = req.body;
    try {
        const password_hash = await hashPassword(password)
        role = "client"
        const result = await model.createUser(login, password_hash, role);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

async function hashPassword(password) {
    const bcrypt = require('bcrypt');
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const password_hash = await bcrypt.hash(password, salt);
        return password_hash;
    } catch (err) {
        console.error("Hashing error:", err);
        res.status(500).json("Failed to hash the password")
    }
}

async function loginUser(req, res){
    const { login, password } = req.body;
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    try {
        const result = await model.getUser(login);
        if (result.length > 0) {
            password_match = await bcrypt.compare(password, result[0]['password_hash'])
            if (password_match) {
                token = createToken(result[0]['id'], result[0]['login'], result[0]['role'])
                console.log(token)
                // const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded)
                res.status(200).json({ token: token });

            } else {
                res.status(400).json({message: 'Failed to login. Invalid credentials.'})
            }
        } else {
            res.status(400).json({message: 'Failed to login. Invalid credentials.'})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

function changeRole(req, res){
    const { role } = req.body;
    res.status(200).json({role: role})
}

function createToken(id, login, role){
    const jwt = require('jsonwebtoken');

    return jwt.sign({ id: id, login: login, role: role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

module.exports = {
    createUser,
    loginUser,
    changeRole
}