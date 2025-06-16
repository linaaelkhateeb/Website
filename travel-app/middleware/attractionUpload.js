const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for attraction images
const attractionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join('public', 'uploads', 'attractions');
        // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filter for image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const uploadAttractionImage = multer({
    storage: attractionStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

module.exports = uploadAttractionImage; 