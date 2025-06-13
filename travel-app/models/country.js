const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: String,
  description: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Country', countrySchema);
