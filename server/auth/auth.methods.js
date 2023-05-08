const jwt = require('jsonwebtoken');
require('dotenv').config();

class authMethods {
    handleCookie (rawCookie) {
        const cookiesString = rawCookie.split("; ");
        const result = {};
        for (var i = 0; i < cookiesString.length; i++) {
            let temp = cookiesString[i].split("=");
            result[temp[0]] = temp[1];
        }
        return result;
    }

    accessTokenIsExpried (token) {
        let result = null;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.message == "jwt expired") {
                    result = true;
                } else res.status(500).send({message: "Your Access Token is invalid!"});
            } else {
                result = false;
            }
        })
        return result;
    }

    refreshTokenIsValid (token) {
        let result = null;
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                result = {
                    result: false,
                    admin: decoded.admin,
                    id: decoded.id
                };
            } else {
                result = {
                    result: true,
                    admin: decoded.admin,
                    id: decoded.id
                };
            }
        })
        return result;
    }

    generateRefreshToken (data) {
        return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    }

    generateAccessToken (data) {
        return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    }
    
}

module.exports = new authMethods();