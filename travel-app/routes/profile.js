// === profile.js (ROUTE) ===

const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/user');


const upload = multer({ dest: 'uploads/' });

// GET profile page
router.get('/', (req, res) => {
  res.render('profile', { user: req.user });
});

// POST update profile fields & password
router.post('/', async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    user.name = updates.name;
    user.email = updates.email;
    user.phone = updates.phone;

    if (user.role === 'agency') {
      user.businessName = updates.businessName;
      user.website = updates.website;
      user.description = updates.description;
    }

    if (updates.newPassword && updates.newPassword.trim() !== '') {
      const hash = await bcrypt.hash(updates.newPassword, 10);
      user.password = hash;
    }

    await user.save();
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }
});

// POST upload profile picture
router.post('/upload', upload.single('profilePic'), async (req, res) => {
  if (!req.file) return res.redirect('/profile');
  const user = await User.findById(req.user._id);
  user.profilePic = '/uploads/' + req.file.filename;
  await user.save();
  res.redirect('/profile');
});

module.exports = router;
