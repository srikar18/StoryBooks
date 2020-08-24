const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Load config file

dotenv.config({ path: './config/config.env' });


// Load DB Connection Configuartion File

const connectDB = require('./config/db');

connectDB();

// Passport Configuartion

require('./config/passport')(passport);

// Loading express app

const app = express();

// Body Parser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setup Morgan

app.use(morgan('dev'));

// Static Folder

app.use(express.static(path.join(__dirname, 'public')));

// Method override

app.use(methodOverride('_method'))

// Handlebar Helpers

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

// Setup Templating Engine

app.engine('.hbs', exphbs({
    helpers:
        { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Sessions Middleware

app.use(session({
    secret: 'its-a-secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

// Set global variable

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// Setup routes

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// Listening on port 4500

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
