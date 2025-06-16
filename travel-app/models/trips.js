const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  title: String,
  description: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  price: Number,
  city: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: Boolean,
  
  // 👇 Add this
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  imageURL: String
});

module.exports = mongoose.model('Trip', tripSchema)
