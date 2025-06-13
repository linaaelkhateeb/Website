const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  title: String,
  name: String,
  description: String,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  locations: [String], // or [Object] if it includes lat/lng later
  price: Number,
  isApproved: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Attraction', attractionSchema);
