const model = require('./userModel')
const user_prod_model = require('../UserProductVisibility/userProductModel')
const prodcuts_model = require('../Product/productModel')
require('dotenv').config();

//Function to create a new user and return a token if successful
async function createUser(req, res) {
    const { login, password } = req.body;
    try {
        const password_hash = await hashPassword(password)
        role_id = 1
        const result = await model.createUser(login, password_hash, role_id);
        const token = createToken(result.insertId, login, role_id)
        res.status(201).json({ message: 'User created successfully', token: token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

//Function to to hash the password
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
//Function to verify user login and return a token if successful
async function loginUser(req, res){
    const { login, password } = req.body;
    const bcrypt = require('bcrypt');
    try {
        const result = await model.getUser(login);
        if (result.length > 0) {
            password_match = await bcrypt.compare(password, result[0]['password_hash'])
            if (password_match) {
                token = createToken(result[0]['id'], result[0]['login'], result[0]['role_id'])
                res.status(200).json({ token: token, role: result[0]['role_id'] });

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

//Function to update specific user by ID
async function updateUser(req, res){
    const { login, password, broker_secret} = req.body;
    const {id} = req.params
    try {
        let password_hash = ""
        if (password) {
            password_hash = await hashPassword(password)
        }
        const result = await model.updateUser(id, login, password_hash)
        res.status(200).json({message: "Success: user updated."})
    } catch(error){
        res.status(500).json({Error: error})
    }
}

//Function to get all clients
async function getAllUsers(req, res){
    try {
        const result = await model.getUsers()
        res.status(200).json({users: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

//Function to get a client by ID
async function getUser(req, res){
    try {
        const {id} = req.params
        const result = await model.getUserEditData(id)
        res.status(200).json({user: result})
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

//Function get user-product visibility by specific user ID
async function getUserProductView(req, res){
    try {
        const {id} = req.params
        // Get all user-product visibility fields by specific user ID
        const prodct_view = await user_prod_model.getUserProdByUserId(id)
        // Get all products to add their fields later
        const all_products = await prodcuts_model.getAllProducts()
        // users to verify if the user exists in the first place
        const all_users = await model.getUsers()

        if (all_users.some(user => user.id == id)){
            // add all products to the product view so that they can be enabled in the future
            // Set ID to -1 to distinguish from the rest
            all_products.forEach(product => {
                if (!prodct_view.some(view => view.product_id == product.id)) {
                    prodct_view.push({id: -1, user_id: id, product_id: product.id,show_description: 0, show_price: 0, show_features: 0})
                }
            })
            prodct_view.forEach(view => {
                const product = all_products.find(product => product.id == view.product_id)
                view.product_name = product.product_name
            })

            res.status(200).json({user_prod_view: prodct_view})
        } else {
            res.status(500).json({Error: 'User doesnt exist.'})
        }
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

//Function to verify if the provided broker code matches the one in .env
async function verifyBroker(req, res){
    const { broker_code} = req.body;
    const { BROKER_SECRET } = process.env;
    if (broker_code == BROKER_SECRET) {res.status(200).json({message: 'Success'})}
    else {res.status(400).json({error: 'Incorrect Broker Code'})}
}

//Function to delete a user by ID
async function deleteUser(req, res) {
    const {id} = req.params
    try {
        const result = await model.deleteUser(id)
        res.status(200).json({ message: 'User deleted successfully' });
    } catch(error) {
        res.status(500).json({Error: error})
    }
}

//Function to create a new token
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
    updateUser,
    getAllUsers,
    deleteUser,
    getUser,
    verifyBroker,
    getUserProductView
}