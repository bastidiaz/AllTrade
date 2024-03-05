const express = require('express')
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const path = require('path');

const uri = 'mongodb://127.0.0.1:27017'

const Ticket = require("./models/Ticket.js");
const User = require("./models/User.js");
const Reply = require("./models/Reply.js");

const ticketControl = require("./controllers/ticketControl.js");
const indexControl = require("./controllers/indexControl.js");


async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

const app = express();

app.engine('hbs', hbs.engine({extname: 'hbs'}) );
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', indexControl.showHome);
app.get('/tickets', ticketControl.showTickets);

app.use(express.static('public'));

connect();

app.listen(8000, () => {
    console.log("Server started on port 8000")
})