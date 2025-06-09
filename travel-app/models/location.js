const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            required: true,
        },
        isApproved: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Location', locationSchema)
