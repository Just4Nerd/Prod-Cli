const jwt = require('jsonwebtoken');
require('dotenv').config();

// Hanldes token verification for client
async function verifyClientToken(req, res, next) {
    const token = req.header('token');
    if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role != "1"){
                return res.status(403).json({ error: 'Access denied' });
            }
            req.current_user_id = decoded.id;
            req.current_role = "client";
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
};

// Hanldes token verification for broker
async function verifyBrokerToken(req, res, next) {
    const token = req.header('token');
    if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role != "2"){
                return res.status(403).json({ error: 'Access denied' });
            }
            req.current_user_id = decoded.id;
            req.current_role = "broker";
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
};

module.exports = {verifyClientToken, verifyBrokerToken}