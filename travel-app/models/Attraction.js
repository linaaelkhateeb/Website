// models/Attraction.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const attractionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  images: [
    {
      type: String
    }
  ],
  ratingStats: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
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

// Virtual for reviews
attractionSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'reviewable',
  options: { sort: { createdAt: -1 } }
});

// Update timestamps
attractionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update rating statistics
attractionSchema.methods.updateRatingStats = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { reviewable: this._id, status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length > 0) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      distribution[rating]++;
    });

    this.ratingStats = {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: distribution
    };
  }

  return this.save();
};

// Enable virtuals in JSON
attractionSchema.set('toJSON', { virtuals: true });
attractionSchema.set('toObject', { virtuals: true });

attractionSchema.virtual('averageRating').get(function() {
  if (!this.ratingStats || !this.ratingStats.totalReviews) return 0;
  return this.ratingStats.averageRating || 0;
});

module.exports = mongoose.model('Attraction', attractionSchema);
