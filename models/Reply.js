const mongoose = require('mongoose');
const User = require('./User.js');
const Ticket = require('./Ticket.js');
const { Schema, model } = mongoose;

const replySchema = new Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Ticket,
        required: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    description: {
        type: String,
        required: true
    },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
