const jwt = require('jsonwebtoken');

// Middleware to check if the user has the required role
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

            // Check if the user's role is in the allowed roles
            if (!allowedRoles.includes(user.role)) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user; // Attach user info to request
            next(); // Proceed to the next middleware or route handler
        });
    };
}

module.exports = { authorizeRoles };
