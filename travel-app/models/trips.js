// models/trip.js
const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }], // ✅ NEW FIELD
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
)


module.exports = mongoose.model('trips', tripSchema)
