const mongoose = require('mongoose');
const User = require('./User.js');
const Ticket = require('./clientTickets.js');
const { Schema, model } = mongoose;

const replySchema = new Schema({
    orderNum: {
        type: String,
        ref: Ticket,
        required: true
    },
    postedBy: {
        type: String,
        ref: Ticket,
        required: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
