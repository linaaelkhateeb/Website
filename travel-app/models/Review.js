const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Make the reference flexible for both attractions and restaurants
  reviewable: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'reviewableType'
  },
  reviewableType: {
    type: String,
    required: true,
    enum: ['Attraction', 'Restaurant']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  photos: [{
    url: String,
    caption: String
  }],
  helpfulVotes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get average rating for an attraction/restaurant
reviewSchema.statics.getAverageRating = async function(reviewableId) {
  const result = await this.aggregate([
    { $match: { reviewable: reviewableId, status: 'approved' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } }
  ]);
  return result[0]?.averageRating || 0;
};

module.exports = mongoose.model('Review', reviewSchema);
