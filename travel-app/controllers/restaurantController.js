const Restaurant = require('../models/restaurant')

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate(
            'trip location createdBy'
        )

        res.render('restaurants/index', {
            restaurants,
            title: 'Restaurants',
            user: req.user || null, // ✅ Add user to avoid ReferenceError
            error: req.flash('error'),
            success: req.flash('success'),
        })
    } catch (err) {
        console.error('Error loading restaurants:', err.message)
        res.status(500).send('Error loading restaurant list')
    }
}

exports.getAddRestaurantForm = async (req, res) => {
    try {
        res.render('restaurants/add', {
            user: req.user || null,
            error: req.flash('error'),
            success: req.flash('success'),
        })
    } catch (err) {
        console.error('Error loading add form:', err.message)
        res.status(500).send('Error loading form data')
    }
}

exports.postAddRestaurant = async (req, res) => {
    try {
        const imagePath = req.file
            ? `/uploads/${req.user._id}/${req.file.filename}`
            : ''

        const newRestaurant = new Restaurant({
            name: req.body.name,
            description: req.body.description,
            cuisine: req.body.cuisine,
            imageUrl: imagePath,
            priceRange: req.body.priceRange,
            rating: req.body.rating,
            createdBy: req.user._id,
        })

        await newRestaurant.save()
        req.flash('success', 'Restaurant added.')
        res.redirect('/restaurants')
    } catch (err) {
        console.error('Error saving restaurant:', err.message)
        req.flash('error', 'Error adding restaurant.')
        res.redirect('/restaurants/add')
    }
}
