// routes/attractionWeb.js
const express    = require('express');
const router     = express.Router();
const Attraction = require('../models/Attraction');
const Review = require('../models/Review');

// List all attractions (EJS view)
router.get('/', async (req, res, next) => {
  try {
    const attractions = await Attraction.find()
      .populate('country location category');
    res.render('attractions/index', { attractions });
  } catch (err) {
    next(err);
  }
});

// Show one attraction (EJS view)
// routes/attractionWeb.js
router.get('/', async (req, res, next) => {
  try {
    const attractions = await Attraction.find()
      .populate('country')
      .populate('location')
      .populate('category');
    res.render('attractions/index', { attractions });
  } catch (err) {
    next(err);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const attraction = await Attraction.findById(req.params.id)
      .populate('country')
      .populate('location')
      .populate('category');
    if (!attraction) {
      // If MongoDB found no document with that ID, show an error page
      return res.status(404).render('error', { message: 'Not found' });
    }
    // Fetch all approved reviews for this attraction
    const reviews = await Review.find({ reviewable: attraction._id, reviewableType: 'Attraction', status: 'approved' })
      .populate('user', 'name');
    let userReview = null;
    if (req.user) {
      userReview = await Review.findOne({ reviewable: attraction._id, reviewableType: 'Attraction', user: req.user._id });
    }
    // Otherwise, render the detail view
    res.render('attractions/show', { attraction, reviews, userReview });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
