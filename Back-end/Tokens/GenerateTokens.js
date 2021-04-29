const jwt = require('jsonwebtoken');

const generateToken = (res, userId, userName, fullName) => {
    const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
    const token = jwt.sign({ userId, userName, fullName }, process.env.JWT_KEY, {
        expiresIn: process.env.DB_ENV === 'testing' ? '1d' : '7d',
    });
    return [token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,
    }];
}

module.exports = generateToken;