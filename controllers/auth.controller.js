const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// Utility to sign JWT
const signToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d'  }
    );
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const newUser = await User.create({ username, email, password, role });

        const token = signToken(newUser);
        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({
            message: 'User registered',
            user: { user_id: newUser.user_id, username, email, role },
        });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.validPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken(user);
        res.cookie('token', token, { httpOnly: true });

        res.json({ message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};


