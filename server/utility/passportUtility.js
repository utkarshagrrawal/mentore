const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const GenerateSignature = (payload) => {
    return jwt.sign(payload, process.env.APP_SECRET_KEY, { expiresIn: '1d' });
}

const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

const GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}

module.exports = {
    GenerateSignature,
    GenerateSalt,
    GeneratePassword,
}
