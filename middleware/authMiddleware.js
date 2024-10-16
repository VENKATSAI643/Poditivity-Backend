const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        if (user.role !== 'admin' && user.role !== 'manager') {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Store user info in request
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = { authenticateToken };
