const express = require('express');
const router  = express.Router();
const Trip    = require('../models/trips');

// 1) SEARCH — must come first
// GET /trips/search?q=…
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const trips = await Trip.find({ 
      title: new RegExp(q, 'i') 
    });
    // render the template, passing trips
    res.render('trips/search', { trips, query: q });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// 2) FETCH ONE BY ID
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trip', error: err });
  }
});

module.exports = router;
