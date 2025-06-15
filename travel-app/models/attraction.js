const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  price: Number,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  }
});

const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;
