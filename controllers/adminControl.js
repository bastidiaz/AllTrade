const { Client } = require('../models/User');
const User = require('../models/User');
const Tickets = require('../models/clientTickets');
const moment = require('moment');

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
            let clients = await User.find({ isAdmin: false }); // Query non-admin clients
            clients = clients.map(client => {
                const formattedDate = moment(client.dateMade).format('MMMM D, YYYY');
                return {
                    companyName: client.companyName,
                    email: client.email,
                    username: client.username,
                    lastname: client.lastname,
                    firstname: client.firstname,
                    dateMade: formattedDate
                };
            });
            res.render('all-clients',{admin, clients});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }    
    },
};

module.exports = adminControl;