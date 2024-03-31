const express = require('express')
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const connectMongo = require('connect-mongo');

//const uri = 'mongodb://127.0.0.1:27017/AllTrade'
// const uri = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'
const uri = 'mongodb+srv://franceeee09:_apdev2223@fairyfloss.lucgr7f.mongodb.net/?retryWrites=true&w=majority&appName=fairyfloss';

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
    // mongoUrl: 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue',
    mongoUrl: 'mongodb+srv://franceeee09:_apdev2223@fairyfloss.lucgr7f.mongodb.net/?retryWrites=true&w=majority&appName=fairyfloss',

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

// app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    helpers: {
        isEqual: function(value1, value2, options) {
            return value1 === value2 ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');


const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};



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

//app.post('/tickets/:username', /** ensureAuthenticated,**/ ticketControl.showTickets);
app.get('/tickets', ticketControl.showTickets);
app.post('/tickets/create', ticketControl.createTicket);
app.post('/tickets/accept', ticketControl.acceptTicket);
app.post('/tickets/delete', ticketControl.deleteTicket);
app.post('/tickets/cancel', ticketControl.cancelTicket);
app.post('/tickets/update', ticketControl.updateTicketStatus);
//inquiry
app.post('/send', inquiryControl.sendInquiry);

app.get('/admin', ensureAuthenticated, adminControl.showDashboard);
app.get('/all-tickets', ensureAuthenticated, ticketControl.showTickets);
app.post('/all-tickets/accept', ensureAuthenticated, ticketControl.acceptTicket);
app.post('/all-tickets/reject', ensureAuthenticated, ticketControl.rejectTicket);
app.get('/all-clients', ensureAuthenticated, adminControl.showAllClients);
app.post('/addAccount', ensureAuthenticated, adminControl.addAccount);
app.post('/updateClient/:username', ensureAuthenticated, adminControl.updateClient);
app.post('/deleteClient/:username', ensureAuthenticated, adminControl.deleteClient);
// app.get('/view-client/:username', ensureAuthenticated, adminControl.viewClient);



connect();

app.listen(8000, () => {
    console.log("Server started on port 8000")
})