const multer = require('multer');
const path = require('path');
const fs = require('fs');

// For country uploads (static folder)
const countryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/countries');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

// For user uploads (user-specific folder)
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(
      __dirname,
      '..',
      'public',
      'uploads',
      req.user._id.toString()
    );
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

module.exports = {
  uploadCountry: multer({ storage: countryStorage }),
  uploadUser: multer({ storage: userStorage })
};
