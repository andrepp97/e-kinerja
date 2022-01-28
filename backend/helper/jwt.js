const jwt = require('jsonwebtoken')

module.exports = {
    createJWTToken: (payload) => {
        return jwt.sign(payload, 'ekinerja', {
            expiresIn: '24h'
        })
    }
}