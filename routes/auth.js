const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerValidation } = require('../middleware/validation');
const { check, validationResult } = require('express-validator'); // Make sure this line is present
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import your authentication middleware
const { authorizeRoles } = require('../middleware/authorizationMiddleware');


router.post('/register', registerValidation, async (req, res) => {
    const { username, email, password,role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const newUser = new User({ username, email, password,role });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password,role } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: "Protected content",
        user: req.user // Assuming you're attaching the user to req.user in your authMiddleware
    });
});

router.get('/tasks', authenticateToken, authorizeRoles('admin', 'manager'), (req, res) => {
    res.json({ message: 'This is a protected route, accessible to admins and managers.' });
});


module.exports = router;
