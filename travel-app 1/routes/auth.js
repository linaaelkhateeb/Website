const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

// Register handler
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' })
        }

        const newUser = new User({ name, email, password, role })
        await newUser.save()

        return res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        console.error('Registration error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Login handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            return res
                .status(401)
                .json({ message: info.message || 'Invalid credentials' })
        }

        req.logIn(user, (err) => {
            if (err) return next(err)
            return res.status(200).json({
                message: 'Logged in successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            })
        })
    })(req, res, next)
})

// Logout handler
router.post('/logout', (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: 'Logged out successfully' })
    })
})

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.status(403).json({ message: 'Admins only' })
}

module.exports = { ensureAdmin }
module.exports = router
