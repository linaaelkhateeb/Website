const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Booking =
    mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

module.exports = Booking
