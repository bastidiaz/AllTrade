const mongoose = require('mongoose');
const User = require('./User.js');
const { Schema, model } = mongoose;

const ticketSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    orderNum: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    prioLevel: {
        type: Number,
        required: true
    },
    capacityUtilization: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'IN PROGRESS', 'ON THE WAY', 'COMPLETED'],
        required: true
    },
    otherDetails: {
        type: String,
        required: true
    },
    handlerUsername: {
        type: String,
        required: true
    },
    companyUsername: {
        type: String,
        required: true
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;