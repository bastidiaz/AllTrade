const User = require("../models/User.js");
const bcrypt = require('bcrypt');

const registerControl = {
    showRegistration(req, res) {
        res.render("register");
    },
    
    async submitRegistration(req, res) {
        // const data = {
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: req.body.password,
        //     dateMade: new Date(),
        //     isAdmin: false
        // };
        const { firstName, lastName, username, email, password } = req.body;


        // check for existing user
        
    
        try {
            const Existing = await User.findOne({$or: [{username}, {email}] });
            if(Existing){
                return res.status(400).json({message: 'Username already exists'});
            }

            //hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            //create record in userscchma
            const newUser = new User({
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
                dateMade: new Date(),
                isAdmin: false
            });

            console.log("New User Data:", newUser);


            await newUser.save();
            req.session.username = username;
            res.redirect("login");
        }catch (error){
            console.error('Error creating account:', error);
            res.status(500).send("An error occurred.");
        }
    }
};

module.exports = registerControl;