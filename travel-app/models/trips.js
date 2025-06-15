const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isApproved: { type: Boolean, default: false },
        price: { type: Number, required: true },
        city: { type: String, required: true },

        //  Add this:
        locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    },
    { timestamps: true }
)

module.exports = mongoose.model('trips', tripSchema)
