const Ticket = require('../models/Ticket.js');

const ticketControl = {
    async showTickets(req, res) {
        let {page, limit} = req.query;
        let tickets = await Ticket.find().limit(limit).exec();
        tickets = tickets.map(ticket => {
            return {
                orderNum: ticket.orderNum,
                creationDate: ticket.creationDate,
                prioLevel: ticket.prioLevel,
                userAssigned: ticket.userAssigned
            }
        });
        res.render("tickets", {tickets: tickets});
    }
};


module.exports = ticketControl;