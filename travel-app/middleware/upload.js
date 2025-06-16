const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(
            __dirname,
            '..',
            'public',
            'uploads',
            req.user._id.toString()
        )

        // Create the user's upload folder if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true })

        cb(null, uploadPath)
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s+/g, '-')
        cb(null, uniqueName)
    },
})

const upload = multer({ storage })

module.exports = upload
