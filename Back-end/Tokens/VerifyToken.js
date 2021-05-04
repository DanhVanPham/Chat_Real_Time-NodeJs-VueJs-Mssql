const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const verifyToken = async(req, res, next) => {
    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.status(403).json('Access denied!');
        }
        const decrypt = await jwt.verify(token, process.env.JWT_KEY);
        req.user = {
            tokenUserId: decrypt.userId,
            tokenFullName: decrypt.fullName,
            tokenUserName: decrypt.userName
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
};

module.exports = verifyToken;

// verifyToken.js file