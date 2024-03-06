const Ticket = require('../models/Ticket.js');

const ticketControl = {
    async showTickets(req, res) {
        const username = req.params.username;
        let tickets = await Ticket.find({assignedUser: username}, undefined, undefined).exec();
        tickets = tickets.map(ticket => {
            return {
                orderNum: ticket.orderNum,
                creationDate: ticket.creationDate,
                prioLevel: ticket.prioLevel,
                orderStatus: ticket.orderStatus,
            }
        });
        res.render("tickets", {tickets: tickets, username});
    }
};


module.exports = ticketControl;