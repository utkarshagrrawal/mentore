const jwt = require('jsonwebtoken');
const { deleteFromRedis, getFromRedis } = require("../utility/redisConnection");


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

const authentication = async (req, res, next) => {
    const validate = await validateSignature(req, res);
    if (validate) {
        next();
    } else {
        return res.json({ error: 'Unauthorized' })
    }
}

module.exports = {
    authentication
}