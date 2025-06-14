const morgan = require('morgan')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const path = require('path')
const dotenv = require('dotenv')  
const Attraction = require('./models/Attraction')
const reviewRoutes     = require('./routes/reviews');



dotenv.config()

require('./config/db') // MongoDB connection
require('./config/passport')(passport) // ✅ Correctly initialize Passport strategy

const app = express()

// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // ✅ Parse JSON requests (e.g., Postman)

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Express session
app.use(
    session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: false,
    })
) 

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Flash messages
app.use(flash())



// // Middleware to pass flash messages to all views
// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });

// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
// Middleware to pass flash messages and user data to all views

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user; // ✅ makes `user` available in all EJS views
    next();
});

const attractionRoutes = require('./routes/attractions');
const attractionWeb = require('./routes/attractionWeb');



// Routes
app.use('/agency', require('./routes/agencyCountryRequests'))


// Routes
app.use('/agency', require('./routes/agencyCountryRequests'))
app.use('/', require('./routes/auth'))
app.use('/admin/trips', require('./routes/admintrips'))
app.use('/dashboard', require('./routes/users'))
app.use('/agency/trips', require('./routes/agencytrips'))
app.use('/agency/view', require('./routes/agencyViewData'))
app.use('/agency/locations', require('./routes/agencyLocations'))
app.use('/admin/locations', require('./routes/adminLocations'))
app.use('/admin', require('./routes/adminusers'))
app.use('/api/v1/attractions', attractionRoutes);
app.use('/attractions', attractionWeb);

app.use(
  '/api/v1/attractions/:id/reviews',
  reviewRoutes
);




// ✅ Country management routes
app.use('/admin/countries', require('./routes/admincountries'))
app.use('/agency/countries', require('./routes/agencyCountryRequests'))

// ✅ Category management routes
app.use('/admin/categories', require('./routes/adminCategories'))

// MongoDB connection
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'proj-database',
    })
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err) => {
        console.log(err)
    })

app.get('/', async (req, res, next) => {
  try {
    // Ensure at least one country and location exist
    const Country = require('./models/country');
    const Location = require('./models/location');
    const Category = require('./models/category');
    let country = await Country.findOne();
    if (!country) {
      country = await Country.create({ name: 'Sample Country', description: 'A sample country', isApproved: true });
    }
    let location = await Location.findOne();
    if (!location) {
      location = await Location.create({ name: 'Sample Location', description: 'A sample location', country: country._id, isApproved: true });
    }
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ name: 'Sample Category', description: 'A sample category' });
    }
    // Update attractions missing country/location or image
    const Attraction = require('./models/Attraction');
    const sampleImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    await Attraction.updateMany({ $or: [ { country: { $exists: false } }, { country: null } ] }, { country: country._id });
    await Attraction.updateMany({ $or: [ { location: { $exists: false } }, { location: null } ] }, { location: location._id });
    await Attraction.updateMany({ $or: [ { category: { $exists: false } }, { category: null } ] }, { category: category._id });
    await Attraction.updateMany({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } } ] }, { images: [sampleImage] });
    // Create a sample attraction if none exist
    const attractionCount = await Attraction.countDocuments();
    if (attractionCount === 0) {
      await Attraction.create({
        name: 'Sample Attraction',
        description: 'A beautiful place to visit!',
        country: country._id,
        location: location._id,
        category: category._id,
        price: 20,
        images: [sampleImage]
      });
    }
    // Fetch attractions for homepage
    const attractions = await Attraction
      .find()
      .limit(5)
      .sort({ createdAt: -1 })
      .populate('country location category');
    res.render('home', {
      user: req.user,
      success: req.flash('success'),
      error: req.flash('error'),
      attractions
    });
  } catch (err) {
    next(err);
  }
});


// Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
