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

// Global flash message variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require('./routes/auth'))
app.use('/dashboard', require('./routes/users'))

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

// Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
