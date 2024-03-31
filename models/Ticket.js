const mongoose = require('mongoose');
const User = require('./User.js');
const { Schema, model } = mongoose;

const ticketSchema = new mongoose.Schema({
    clientUsername: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'IN PROGRESS', 'ON THE WAY', 'COMPLETED'],
        default: 'PENDING',
    },
    handlerUsername: {
        type: String,
        default: 'N/A'
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specs: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;