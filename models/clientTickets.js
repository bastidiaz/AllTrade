//added schema, in replace of the original Ticket schema because there
//is additional stuff

const mongoose = require('mongoose');
const Counter = require('../models/ticketCounter'); 

const clientTicketSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    orderNum: {
        type: String,
        default: 'NUM000001' // Default value for orderNum
    },
    creationDate: {
        type: Date,
        required: true
    },
    prioLevel: {
        type: String, //changed from number to string
        required: true
    },
    capacityUtilization: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'IN PROGRESS', 'ON THE WAY', 'COMPLETED', 'CANCELLED'],
        required: true
    },
    otherDetails: {
        type: String,
        required: true
    },
    handler: {
        type: String,
        default: "no one accepted this ticket yet"
    },
    messageUpdates: {
        type: String,
        default: "no updates yet"
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
            this.orderNum = `NUM${('00000' + counter.sequence_value).slice(-6)}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const clientTicket = mongoose.model('clientTicket', clientTicketSchema);

module.exports = clientTicket;