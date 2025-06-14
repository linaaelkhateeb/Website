const morgan = require('morgan')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

require('./config/db') // MongoDB connection
require('./config/passport')(passport) // initialize Passport strategy

const app = express()

// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.user = req.user //  makes `user` available in all EJS views
    next()
})

// Routes
const countryRoutes = require('./routes/countryRoutes')
app.use('/countries', countryRoutes)
const tripRoutes = require('./routes/tripRoutes')
app.use('/trips', tripRoutes)
app.use('/agency', require('./routes/agencyCountryRequests'))
app.use('/', require('./routes/auth'))
app.use('/admin/trips', require('./routes/admintrips'))
app.use('/dashboard', require('./routes/users'))
app.use('/agency/trips', require('./routes/agencytrips'))
app.use('/agency/view', require('./routes/agencyViewData'))
app.use('/agency/locations', require('./routes/agencyLocations'))
app.use('/admin/locations', require('./routes/adminLocations'))
app.use('/admin', require('./routes/adminusers'))
app.use('/attractions', require('./routes/attractions'))

// Country management routes
app.use('/admin/countries', require('./routes/admincountries'))
app.use('/agency/countries', require('./routes/agencyCountryRequests'))

// Category management routes
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

app.get('/', (req, res) => {
    res.render('home')
})

// Server
app.listen(3003, () => {
    console.log('Server running on http://localhost:3003')
})
