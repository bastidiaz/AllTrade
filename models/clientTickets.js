//added schema, in replace of the original Ticket schema because there
//is additional stuff

const mongoose = require('mongoose');
const Counter = require('../models/ticketCounter'); 

const clientTicketSchema = new mongoose.Schema({
    orderNum: {
        type: String,
        unique: true
    },
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
        default: 'No one accepted this ticket yet',
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
    },
    messageUpdates: {
        type: String,
        default: "No updates yet"
    }
});

//AUTO INCREMENT OF TICKET NUMBER
clientTicketSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'ticketId' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            this.orderNum = `${('00000' + counter.sequence_value).slice(-6)}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const clientTicket = mongoose.model('clientTicket', clientTicketSchema);

module.exports = clientTicket;