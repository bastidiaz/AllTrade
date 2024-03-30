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
    description: {
        type: String,
        required: true
    },
    isHandled: {
        type: Boolean,
        default: false
    }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
