const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
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
})

module.exports = mongoose.model('Trip', tripSchema)
