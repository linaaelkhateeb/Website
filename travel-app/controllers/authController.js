// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const User = require('../models/User'); // or wherever your User model is

// exports.sendResetLink = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.render('auth/forgetpass', { error: "Email not found" });
//   }

//   const token = crypto.randomBytes(32).toString('hex');
//   user.resetToken = token;
//   user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
//   await user.save();

//   const resetURL = `http://${req.headers.host}/resetpass/${token}`;

//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   await transporter.sendMail({
//     to: user.email,
//     subject: 'Reset your password',
//     html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`
//   });

//   res.render('auth/forgetpass', { success: "Check your email for a reset link." });
// };
