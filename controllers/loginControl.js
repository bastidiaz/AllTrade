const User = require('../models/User.js');
//added section:
const bcrypt = require('bcrypt');


const loginControl = {
    showLoginForm(req, res) {
        if (!req.session.user) {
            res.render("login");
        } else {
            // Redirect using the username from the session
            res.redirect('/tickets');
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
            const user = await User.findOne({ username: req.body.usernameLogin });
            if (!user) {
                return res.render("login", { errorMessage: 'User not found' });
            }

            const passwordLogin = req.body.passwordLogin;
            const samePass = await bcrypt.compare(passwordLogin, user.password);

            if (samePass) {
                req.session.user = { username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname };

                // Simplify session handling based on 'remember' checkbox
                if (req.body.remember === "on") {
                    req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; // 3 weeks
                } else {
                    req.session.cookie.expires = false; // Session ends when browser closes
                }

                if (user.isAdmin) {
                    console.log('Session User:', req.session.user);
                    console.log('Admin Logged In:', user);
                    req.session.user = {
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname
                    };
                    res.redirect('/admin/' + req.session.user.username);
                } else {
                    res.redirect('/tickets');
                }
            } else {
                res.render("login", { errorMessage: 'Invalid email or password' });
            }
        } catch (error) {
            console.error(error);
            res.status(501).send("An error occurred during login.");
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