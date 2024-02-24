const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getFromRedis, checkInRedis, deleteFromRedis } = require('./redisConnection');
require('dotenv').config();

const validateSignature = async (req, res) => {
    const signature = await getFromRedis('token');
    if (signature) {
        try {
            const payload = jwt.verify(signature, process.env.APP_SECRET_KEY);
            req.user = payload;
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                deleteFromRedis('token');
                return false;
            }
            return false;
        }
    }
    return false;
}

const GenerateSignature = (payload) => {
    return jwt.sign(payload, process.env.APP_SECRET_KEY, { expiresIn: '1d' });
}

const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

const GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}

const authentication = async (req, res, next) => {
    const validate = await validateSignature(req, res);
    if (validate) {
        next();
    } else {
        return res.json({ error: 'Unauthorized' })
    }
}

module.exports = {
    validateSignature,
    GenerateSignature,
    authentication,
    GenerateSalt,
    GeneratePassword,
}
