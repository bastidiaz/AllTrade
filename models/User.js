const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    firstname: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    dateMade: Date,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;