// controllers/attractionController.js
const Attraction = require('../models/Attraction');

// GET /attractions
exports.getAllAttractions = async (req, res, next) => {
  try {
    const attractions = await Attraction.find()
      .populate('country location category')
      .sort({ createdAt: -1 });
    res.json(attractions);
  } catch (err) {
    next(err);
  }
};

// GET /attractions/:id
exports.getAttractionById = async (req, res, next) => {
  try {
    const attraction = await Attraction.findById(req.params.id)
      .populate('country location category');
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }
    res.json(attraction);
  } catch (err) {
    next(err);
  }
};

// POST /attractions
exports.createAttraction = async (req, res, next) => {
  try {
    const newAttraction = new Attraction(req.body);
    const saved = await newAttraction.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// PUT /attractions/:id
exports.updateAttraction = async (req, res, next) => {
  try {
    const updated = await Attraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Attraction not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /attractions/:id
exports.deleteAttraction = async (req, res, next) => {
  try {
    const deleted = await Attraction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Attraction not found' });
    }
    res.json({ message: 'Attraction deleted' });
  } catch (err) {
    next(err);
  }
};
