const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    isApproved: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Country', countrySchema)
