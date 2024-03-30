const User = require("../models/User.js");
//added section:
const bcrypt = require('bcrypt');

const registerControl = {
    showRegistration(req, res) {
        res.render("register");
    },
    
    // async submitRegistration(req, res) {
    //     const data = {
    //         companyName: req.body.companyName,
    //         username: req.body.username,
    //         email: req.body.email,
    //         password: req.body.password,
    //         dateMade: new Date(),
    //         isAdmin: false
    //     };
    
    //     try {
    //         await User.insertMany([data]);
    //         res.redirect("login");
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("An error occurred.");
    //     }
    // }

    async submitRegistration(req, res) {
        const { companyName, username, email, password } = req.body;
        // check for existing user
        try {
            const Existing = await User.findOne({$or: [{username}, {email}] });
            if(Existing){
                return res.status(400).json({message: 'Username or email already exists'});
            }

            //hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            //create record in userscchma
            const newUser = new User({
                companyName,
                username,
                email,
                password: hashedPassword,
                dateMade: new Date(),
                isAdmin: false
            });

            console.log("New User Data:", newUser);
            
            await newUser.save();
            req.session.username = username;
            res.redirect("/login");
        }catch (error){
            console.error('Error creating account:', error);
            res.status(500).send("An error occurred.");
        }
    }
};

module.exports = registerControl;