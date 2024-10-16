const jwt = require('jsonwebtoken');

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401); // Unauthorized
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            if (!allowedRoles.includes(user.role)) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user;
            next();
        });
    };
}

module.exports = { authorizeRoles };
