// Required dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load env vars
require('dotenv').config();

// Create the Express App
var app = express();

// Database connection
require('./config/database');
// Session configuration
require('./config/passport');

// Routers
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

// Configure view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'static'))); 
app.use(cors());
app.use(cookieParser());

// Mount Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Mount Passport 
app.use(passport.initialize());
app.use(passport.session()); 

// Mount Routers
app.use('/', authRouter);
app.use('/', indexRouter);

// Start the server - listen for requests
app.listen(3000);

