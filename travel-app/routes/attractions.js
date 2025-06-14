const express = require('express')
const router = express.Router()
const Attraction = require('../models/attraction')

// Create attraction
router.post('/', async (req, res) => {
    try {
        const attraction = new Attraction(req.body)
        await attraction.save()
        res.status(201).json(attraction)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create attraction',
            error: err.message,
        })
    }
})

// Get all attractions
router.get('/', async (req, res) => {
    try {
        const attractions = await Attraction.find().populate('country category')
        res.json(attractions)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch attractions',
            error: err.message,
        })
    }
})

module.exports = router
