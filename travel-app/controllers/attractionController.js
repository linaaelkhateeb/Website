const mongoose = require('mongoose')

const Attraction = mongoose.model('Attraction')
const Review = mongoose.model('Review')

// Create attraction
exports.createAttraction = async (req, res) => {
    try {
        console.log("Attempting to create attraction with data:", req.body);
        console.log("Uploaded file info:", req.file);
        const attraction = new Attraction(req.body);
        if (req.file) {
            attraction.image = '/uploads/attractions/' + req.file.filename
        }
        await attraction.save();
        console.log("Attraction saved successfully:", attraction);
        res.status(201).json(attraction);
    } catch (err) {
        console.error('Failed to create attraction:', err);
        res.status(500).json({
            message: 'Failed to create attraction',
            error: err.message,
        })
    }
}

// Get all attractions with average rating
exports.getAllAttractions = async (req, res) => {
    try {
        console.log("Fetching all attractions...");
        const attractions = await Attraction.find()
            .populate('country')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            });
        console.log("Found attractions (getAllAttractions):");
        attractions.forEach(att => console.log(' - ', att.name, ' (ID:', att._id, ')'));

        const attractionsWithAvgRating = attractions.map((attraction) => {
            let averageRating = 0
            if (attraction.reviews.length > 0) {
                const totalRating = attraction.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                )
                averageRating = (
                    totalRating / attraction.reviews.length
                ).toFixed(1)
            }
            return { ...attraction.toObject(), averageRating }
        })

        res.render('attractions/index', {
            attractions: attractionsWithAvgRating,
            user: req.user,
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}

// Get a single attraction with its reviews and average rating
exports.getAttractionById = async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name',
                },
            })
            .populate('country')
            .populate('trips')

        if (!attraction) {
            req.flash('error', 'Attraction not found.')
            return res.redirect('/attractions')
        }

        let averageRating = 0
        if (attraction.reviews.length > 0) {
            const totalRating = attraction.reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            )
            averageRating = (totalRating / attraction.reviews.length).toFixed(1)
        }

        // --- START DEBUG LOGGING ---
        console.log('--- Rendering Attraction Details ---')
        console.log('Attraction Data:', attraction.name, attraction._id)
        console.log('Average Rating:', averageRating)
        console.log('Reviews Count:', attraction.reviews.length)
        // --- END DEBUG LOGGING ---

        res.render('attractions/show', {
            attraction,
            averageRating,
            user: req.user,
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Failed to fetch attraction details.')
        res.redirect('/attractions')
    }
}

// Add a review to an attraction
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body
        const attractionId = req.params.id

        const newReview = new Review({
            rating,
            comment,
            attraction: attractionId,
            user: req.user._id,
        })

        await newReview.save()

        const attraction = await Attraction.findById(attractionId)
        attraction.reviews.push(newReview._id)
        await attraction.save()

        req.flash('success', 'Review added successfully!')
        res.redirect(`/attractions/${attractionId}`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Failed to add review.')
        res.redirect('back')
    }
}

// Get top attractions for the homepage
exports.getTopAttractionsForHomepage = async () => {
    try {
        console.log("Fetching top attractions for homepage...");
        const attractions = await Attraction.find()
            .populate('country')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name',
                },
            })
            .limit(4); // Limit to top 4 attractions for the homepage
        console.log("Found attractions (getTopAttractionsForHomepage):");
        attractions.forEach(att => console.log(' - ', att.name, ' (ID:', att._id, ')'));

        const attractionsWithAvgRating = attractions.map((attraction) => {
            let averageRating = 0
            if (attraction.reviews.length > 0) {
                const totalRating = attraction.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                )
                averageRating = (
                    totalRating / attraction.reviews.length
                ).toFixed(1)
            }
            return { ...attraction.toObject(), averageRating }
        })
        return attractionsWithAvgRating
    } catch (err) {
        console.error(err)
        return [] // Return empty array on error
    }
}
