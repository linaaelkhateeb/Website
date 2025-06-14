const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');
const Attraction = require('../models/Attraction');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

// POST /api/v1/attractions/:id/reviews
router.post('/', ensureAuth, async (req, res, next) => {
  try {
    const { rating, text, photos } = req.body;
    const review = await Review.create({
      user: req.user._id,
      reviewable: req.params.id,
      reviewableType: 'Attraction',
      rating,
      text,
      photos: photos || []
    });

    // Update attraction's rating stats
    const attraction = await Attraction.findById(req.params.id);
    await attraction.updateRatingStats();

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/attractions/:id/reviews
router.get('/', async (req, res, next) => {
  try {
    const { sort = 'newest', filter = 'all' } = req.query;
    let query = { reviewable: req.params.id, reviewableType: 'Attraction' };

    // Apply status filter
    if (filter === 'approved') {
      query.status = 'approved';
    }

    // Apply sorting
    let sortOption = {};
    switch (sort) {
      case 'highest':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOption = { 'helpfulVotes.up': -1, createdAt: -1 };
        break;
      default: // newest
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .sort(sortOption)
      .populate('user', 'name')
      .populate('reviewable', 'name');

    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/attractions/:id/reviews/:reviewId
router.put('/:reviewId', ensureAuth, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { rating, text, photos } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating, text, photos, updatedAt: Date.now() },
      { new: true }
    );

    // Update attraction's rating stats
    const attraction = await Attraction.findById(req.params.id);
    await attraction.updateRatingStats();

    res.json(updatedReview);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/attractions/:id/reviews/:reviewId
router.delete('/:reviewId', ensureAuth, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    // Update attraction's rating stats
    const attraction = await Attraction.findById(req.params.id);
    await attraction.updateRatingStats();

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/attractions/:id/reviews/:reviewId/vote
router.post('/:reviewId/vote', ensureAuth, async (req, res, next) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const review = await Review.findById(req.params.reviewId);
    review.helpfulVotes[vote]++;
    await review.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/attractions/:id/reviews/:reviewId/moderate
router.put('/:reviewId/moderate', ensureAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status },
      { new: true }
    );

    // Update attraction's rating stats
    const attraction = await Attraction.findById(req.params.id);
    await attraction.updateRatingStats();

    res.json(review);
  } catch (err) {
    next(err);
  }
});

// Admin: List all pending reviews
router.get('/admin/reviews', ensureAdmin, async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'pending' }).populate('user', 'name').populate('reviewable', 'name');
    res.render('admin/reviews', { reviews });
  } catch (err) {
    next(err);
  }
});

// Admin: Approve a review
router.post('/admin/reviews/:id/approve', ensureAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (review) {
      // Update attraction stats
      if (review.reviewableType === 'Attraction') {
        const Attraction = require('../models/Attraction');
        const attraction = await Attraction.findById(review.reviewable);
        if (attraction) await attraction.updateRatingStats();
      }
    }
    res.redirect('/admin/reviews');
  } catch (err) {
    next(err);
  }
});

// Admin: Reject a review
router.post('/admin/reviews/:id/reject', ensureAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.redirect('/admin/reviews');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
