const User = require("../models/User.js");

const registerControl = {
    showRegistration(req, res) {
        res.render("register");
    },
    
    async submitRegistration(req, res) {
        const today = new Date();
        const data = { 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            dateMade: today,
        };
    
        try {
            await User.insertMany([data]);
            res.redirect("login");
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred.");
        }
    }
};

module.exports = registerControl;