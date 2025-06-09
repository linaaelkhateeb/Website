const express = require('express')
const router = express.Router()
const Trip = require('../models/trips')

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next()
    return res.status(403).json({ message: 'Admins only' })
}

// Create a trip
router.post('/', ensureAdmin, async (req, res) => {
    try {
        const { title, description, country, category } = req.body

        const newTrip = new Trip({
            title,
            description,
            country,
            category,
        })

        await newTrip.save()
        res.status(201).json(newTrip)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create trip',
            error: err.message,
        })
    }
})

module.exports = router
