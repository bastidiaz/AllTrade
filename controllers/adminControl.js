const { Client } = require('../models/User');
const User = require('../models/User');
const Tickets = require('../models/clientTickets');
const moment = require('moment');
const bcrypt = require('bcrypt');

const adminControl = {
    async showDashboard(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (!req.session.user.isAdmin) {
            return res.redirect('/login');
        }
        try {
            const admin = req.session.user;
            if (!admin) {
                return res.redirect('/login');
            }
            //console.log('Admin Info:', admin);
            const clientCount = await User.countDocuments({isAdmin:false});
            const handleCount = await Tickets.countDocuments({handler: req.session.user.username});
            const ticketCount = await Tickets.countDocuments();
            res.render('admin-dashboard', { admin, clientCount, handleCount, ticketCount });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async showAllClients(req, res) {
        try {
            const admin = req.session.user;
            if (!admin) {
                return res.redirect('/login');
            }
            
            //this is for when you click the create, it would generate default infos in case there is no client info yet.
            const existingDefaultUsers = await User.find({ username: /^default\d*$/ }); // Find usernames starting with "default"
            let nextUsername;
            if (existingDefaultUsers.length > 0) {
                const usernames = existingDefaultUsers.map(user => user.username);
                const latestUsername = usernames.sort().reverse()[0]; 
                const numSuffix = parseInt(latestUsername.replace('default', '')) + 1;
                nextUsername = `default${numSuffix}`;
            } else {
                nextUsername = 'default1'; // If no existing default users, start with "default1"
            }

            let clients = await User.find({ isAdmin: false }); 
            clients = clients.map(client => {
                const formattedDate = moment(client.dateMade).format('MMMM D, YYYY');
                return {
                    companyName: client.companyName,
                    email: client.email,
                    username: client.username,
                    lastname: client.lastname,
                    firstname: client.firstname,
                    dateMade: formattedDate,
                    password: client.password
                };
            });
            res.render('all-clients',{admin, clients, nextUsername});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }    
    },

    async addAccount(req, res) {
        const { companyName, email, username, lastname, firstname,  phoneNumber, password} = req.body;
        // check for existing user
        try {
            const admin = req.session.user;
            if (!admin) {
                return res.redirect('/login');
            }

            const Existing = await User.findOne({$or: [{username}] });
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
                isAdmin: false,
                lastname,
                firstname
            });

            console.log("New User Data:", newUser);
            await newUser.save();
            res.redirect('/all-clients');
        }catch (error){
            console.error('Error creating account:', error);
            res.status(500).json({ success: false, message: 'An error occurred' });
        }
    },

    async updateClient(req, res) {
        const { companyName, email, username, lastname, firstname, phoneNumber, oldUsername } = req.body;
    
        try {
            const admin = req.session.user;
            if (!admin) {
                return res.redirect('/login');
            }
    
            // check if the old username and new username are the same
            if (oldUsername !== username) {
                // if they are different, check if the new username already exists
                const existingClient = await User.findOne({ username });
                if (existingClient) {
                    // return an error response if the new username already exists
                    return res.status(400).json({ error: 'Username is already taken' });
                }
            }
    
            // update the client's information including the username
            const updatedClient = await User.findOneAndUpdate(
                { username: oldUsername },
                { $set: { companyName, email, lastname, firstname, phoneNumber, username } },
                { new: true }
            );
    
            if (!updatedClient) {
                return res.status(404).json({ error: 'Client not found' });
            }
    
            // redirect to the client list page or send a success message
            res.redirect('/all-clients');
        } catch (error) {
            console.error('Error updating client details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteClient(req, res) {
        try {
            const admin = req.session.user;
            if (!admin) {
                return res.redirect('/login');
            }
    
            const username = req.body.username || req.params.username;
            const client = await User.findOneAndDelete({ username:username });
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
    
            res.redirect('/all-clients');
        } catch (error) {
            console.error('Error deleting client:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
    

    // async viewClient(req, res){
    //     console.log("view triggered");
    //     const username = req.params.username;
    //     console.log(usrname);

    //     try{
    //         const client = await User.findById({username});
    //         if(!client){
    //             return res.status(404).json({ error: 'Client not found' });
    //         }
    //         console.log('Client Data:', client); // Log client data for debugging
    //         res.render('client-details',{client});
    //     }catch (error){
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

};

module.exports = adminControl;