const Restaurant = require('../models/restaurant')

exports.getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find().populate(
        'trip location createdBy'
    )
    res.render('restaurants/index', { restaurants, title: 'Restaurants' })
}

// Admin or Agency: Render form to add restaurant
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
        const newRestaurant = new Restaurant({
            ...req.body,
            createdBy: req.user._id,
        })
        await newRestaurant.save()
        req.flash('success', 'Restaurant added.')
        res.redirect('/restaurants')
    } catch (err) {
        req.flash('error', 'Error adding restaurant.')
        res.redirect('/restaurants/add')
    }
}

// (Optional) Add edit/delete later
