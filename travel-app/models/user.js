const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['client', 'admin', 'agency'],
        default: 'client',
    },
    isTrusted: {
        type: Boolean,
        default: false, // All new agencies start untrusted
    },
      businessName: { type: String },
  phone: { type: String },
  website: { type: String },
  description: { type: String },

})

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model('User', userSchema)
