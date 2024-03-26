const User = require('../models/User');
const Tickets = require('../models/clientTickets');

const adminControl = {
    async showDashboard(req, res) {
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
        const admin = req.session.user;
        res.render('all-clients',{admin});
    },

};

module.exports = adminControl;