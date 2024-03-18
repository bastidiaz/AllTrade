const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    companyName: String,
    email: {
        type: String,
        required: false,
        unique: false 
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
