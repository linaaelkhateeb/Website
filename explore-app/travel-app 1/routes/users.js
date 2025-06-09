const express = require('express')
const router = express.Router()

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next()
    return res.status(401).json({ message: 'Unauthorized: Please log in' })
}

router.get('/', ensureAuth, (req, res) => {
    const { role } = req.user
    return res.status(200).json({
        message: `Welcome ${role}`,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    })
})

module.exports = router
