//a counter that makes the ticket serial number automatically increments
//when new one is created.

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;