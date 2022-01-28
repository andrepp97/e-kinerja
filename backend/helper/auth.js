const jwt = require('jsonwebtoken');
const secret = "ekinerja";

module.exports = {
    auth: (req, res, next) => {
        jwt.verify(req.token, secret, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    message: "User not authorized.",
                    error: "User not authorized."
                });
            }

            console.log(decoded)
            req.user = decoded
            next()
        })
    },

    authEmail: (req, res, next) => {
        jwt.verify(req.token, secret, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    message: "URL Expired.",
                    error: "URL Expired."
                });
            }

            console.log(decoded)
            req.email = decoded.email
            next()
        })
    }
}