const jwt = require('jsonwebtoken');

const validateSignature = async (req, res) => {
    const signature = req.headers.authorization;
    if (signature) {
        try {
            const payload = jwt.verify(signature, process.env.APP_SECRET_KEY);
            req.user = payload;
            return { "success": true };
        } catch (error) {
            if (error === 'TokenExpiredError') {
                return { "failure": "JWT Token Expired" }
            }
            return { "failure": "Invalid JWT Token" };
        }
    }
    return { "failure": "JWT Token not found" };
}

const authentication = async (req, res, next) => {
    const validate = await validateSignature(req, res);
    if (validate.success) {
        next();
    } else {
        return res.json({ error: validate.failure })
    }
}

module.exports = {
    authentication
}