const jwt = require('jsonwebtoken');

const validateSignature = async (req, res) => {
    const signature = req.headers.authorization;
    if (signature) {
        try {
            const payload = jwt.verify(signature, process.env.APP_SECRET_KEY);
            req.user = payload;
            return true;
        } catch (error) {
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