const User = require('../models/User.js');
//added section:
const bcrypt = require('bcrypt');


const loginControl = {
    showLoginForm(req, res) {
        if (!req.session.user) {
            res.render("login");
        } else {
            // Redirect using the username from the session
            res.redirect('/tickets/' + req.session.user.username);
        }
    },


    // async submitLoginForm(req, res) {
    //     try {
    //         const user = await User.findOne({ username: req.body.usernameLogin });
    //         if (user && user.password === req.body.passwordLogin) {
    //             // Simplify session handling based on 'remember' checkbox
    //             if (req.body.remember === "on") {
    //                 req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; // 3 weeks
    //             } else {
    //                 req.session.cookie.expires = false; // Session ends when browser closes
    //             }
    //             req.session.user = { username: user.username }; // Store minimal user info in session
    //             res.redirect('/tickets/' + user.username);
    //         } else {
    //             res.render("login", { errorMessage: 'Invalid username or password' });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         res.render("login", { errorMessage: 'An error occurred during login' });
    //     }
    // },

    async submitLoginForm(req, res) {
        try {
            const user = await User.findOne({ email: req.body.emailLogin });
            const passwordLogin = req.body.passwordLogin;
            const samePass = await bcrypt.compare(passwordLogin, user.password); //since the pass is hashed already
            if (user && samePass) {
                // Simplify session handling based on 'remember' checkbox
                if (req.body.remember === "on") {
                    req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; // 3 weeks
                } else {
                    req.session.cookie.expires = false; // Session ends when browser closes
                }
                req.session.user = { username: user.username, email: user.email }; // Store minimal user info in session
                res.redirect('/tickets/' + user.username);
            } else {
                res.render("login", { errorMessage: 'Invalid email or password' });
                res.status(502).send("Invalid email or password.");
            }
        } catch (error) {
            console.error(error);
            res.status(501).send("An error occurred during login.");
            res.render("login", { errorMessage: 'An error occurred during login' });
        }
    },



    endSession(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                res.send("Error ending session");
            } else {
                res.redirect('/login');
            }
        });
    }
};

module.exports = loginControl;