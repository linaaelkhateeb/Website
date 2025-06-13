const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const authController = require('../controllers/authController');


// Show login form
router.get('/login', (req, res) => {
    res.render('auth/login'); // This loads views/auth/login.ejs
});

// Show register form
router.get('/register', (req, res) => {
    res.render('auth/register'); // This loads views/auth/register.ejs
});


// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    req.flash('success', 'Account created. Please log in.');
    return res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Server error. Please try again.');
    return res.redirect('/register');
  }
});

// LOGIN
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

//logoutt
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error', 'Error during logout');
      return res.redirect('/');
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/'); 
  });
});

// //forgetpass
// router.get('/forgetpass', (req, res) => res.render('auth/forgetpass'));
// router.post('/forgetpass', authController.sendResetLink);




module.exports = router;
