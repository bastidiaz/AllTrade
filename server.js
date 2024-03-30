const express = require('express')
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const connectMongo = require('connect-mongo');

//const uri = 'mongodb://127.0.0.1:27017/AllTrade'
const uri = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'

const Ticket = require("./models/Ticket.js");
const User = require("./models/User.js");
const Reply = require("./models/Reply.js");
const Inquiry = require("./models/inquiryForm.js");

const ticketControl = require("./controllers/ticketControl.js");
const indexControl = require("./controllers/indexControl.js");
const loginControl = require("./controllers/loginControl.js");
const registerControl = require("./controllers/registerControl.js");
const inquiryControl = require("./controllers/inquiryControl.js");
const adminControl = require("./controllers/adminControl.js");

const app = express();

const sessionStore = connectMongo.create({
    //mongoUrl: 'mongodb://127.0.0.1:27017/AllTrade',
    mongoUrl: 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue',
    collectionName: 'users',
    ttl: 1 * 24 * 60 * 60,
    autoRemove: 'native'
});

app.use(session({
    secret: 'SECRET KEY',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 0, // Set the cookie to expire when the browser is closed
        expires: false,
        httpOnly: true, // Set HttpOnly flag
    },
}));

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

// FIX LOGIN LOGIC SO USERS DON'T GET INTO INFINITE LOGIN LOOP, ALSO ENSURE USERS DON'T END UP CHECKING OTHER USER'S TICKETS
// const ensureAuthenticated = (req, res, next) => {
//     // Check if the user is authenticated
//     if (!req.session.username) {
//         return res.redirect('/login'); // or respond with an appropriate error message
//     }
//
//     // Authorization: Check if the logged-in user is trying to access their own tickets
//     const requestedUsername = req.params.username;
//     if (req.session.username !== requestedUsername) {
//         return res.status(403).send('Access Denied: You are not allowed to access this page.');
//     }
//
//     next(); // Proceed to the route handler if authentication and authorization checks pass
// };




// app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('hbs', hbs.engine({extname: 'hbs'}) );
app.set('view engine', 'hbs');
app.set('views', './views');

//main pages
app.get('/', indexControl.showHome);
app.get('/services',indexControl.showServices);
app.get('/core', indexControl.showCore);
// user management
app.get("/login", loginControl.showLoginForm);
app.post("/login", loginControl.submitLoginForm);
app.get("/register", registerControl.showRegistration);
app.post("/register", registerControl.submitRegistration);
app.get("/logout", loginControl.endSession);
// tickets

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};


//app.post('/tickets/:username', /** ensureAuthenticated,**/ ticketControl.showTickets);
app.get('/tickets/:username', /** ensureAuthenticated,**/ ticketControl.showTickets);
app.post('/tickets/:username/create', ticketControl.createTicket);
app.post('/tickets/:username/accept', ticketControl.acceptTicket);
app.post('/tickets/:username/delete', ticketControl.deleteTicket);
app.post('/tickets/:username/cancel', ticketControl.cancelTicket);
app.post('/tickets/:username/update', ticketControl.updateTicketStatus);
//inquiry
app.post('/send', inquiryControl.sendInquiry);

app.get('/admin/:username', ensureAuthenticated, adminControl.showDashboard);
app.get('/all-clients', ensureAuthenticated, adminControl.showAllClients);
app.post('/addAccount', ensureAuthenticated, adminControl.addAccount);
// app.get('/view-client/:username', ensureAuthenticated, adminControl.viewClient);


connect();

app.listen(8000, () => {
    console.log("Server started on port 8000")
})