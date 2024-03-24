//const Ticket = require('../models/Ticket.js');
//added section:
const Ticket = require('../models/clientTickets.js');
const User = require('../models/User.js');

const ticketControl = {
    // async showTickets(req, res) {
    //     const username = req.params.username;
    //     let tickets = await Ticket.find({assignedUser: username}, undefined, undefined).exec();
    //     tickets = tickets.map(ticket => {
    //         return {
    //             orderNum: ticket.orderNum,
    //             creationDate: ticket.creationDate,
    //             prioLevel: ticket.prioLevel,
    //             orderStatus: ticket.orderStatus,
    //         }
    //     });
    //     res.render("tickets", {tickets: tickets, username});
    // }

    //render of tickets
    async showTickets(req, res) {    
        if (!req.session.user) {
            return res.redirect('/login');
        }
        try {
            let tickets;
            //admin show tickets
            if (req.session.user.isAdmin) {
                tickets = await Ticket.find().exec();

            //client show tickets
            } else {
                const username = req.session.user.username;
                tickets = await Ticket.find({ clientName: username }).exec();
            }
    
            tickets = tickets.map(ticket => {
                return {
                    orderNum: ticket.orderNum,
                    creationDate: ticket.creationDate,
                    prioLevel: ticket.prioLevel,
                    orderStatus: ticket.orderStatus,
                    capacityUtilization: ticket.capacityUtilization,
                    messageUpdates: ticket.messageUpdates,
                    handler: ticket.handler,
                    otherDetails: ticket.otherDetails
                };
            });
    
            if (!tickets || tickets.length === 0) {
                return res.render("tickets", { tickets: [], username: req.session.user.username });
            }
    
            res.render("tickets", { tickets: tickets, username: req.session.user.username });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching tickets.");
        }
    },

    //ticket creation, not yet working right
    async createTicket(req, res) {
        if (!req.session.user || req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }
        
        const loggedInUsername = req.session.user.username;
        try {
            const user = await User.findOne({ username: loggedInUsername });
            if (!user) {
                return res.status(404).send("User not found");
            }

            const ticketData = {
                clientName: loggedInUsername,
                creationDate: new Date(),
                orderStatus: "PENDING",  // Default status
                handler: "no one accepted this ticket yet",  // Default handler
                messageUpdates: "no updates yet",  // Default message updates
                otherDetails: req.body.otherDetails,
                capacityUtilization: req.body.capacityUtilization,
                prioLevel: req.body.prioLevel
            };

            const ticket = await Ticket.create(ticketData);
            res.status(201).json(ticket);  // Respond with the newly created ticket data
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred during ticket creation.");
        }
    },

    //accept ticket by admin
    async acceptTicket(req, res) {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const ticketNumber = req.params.ticketNumber;
            const ticket = await Ticket.findOne({ orderNum: ticketNumber });

            if (ticket.orderStatus !== "PENDING") {
                return res.status(400).send("Ticket cannot be accepted.");
            }

            // Update ticket status to "ACCEPTED" and store the admin who handled it
            ticket.orderStatus = "ACCEPTED";
            ticket.handler = req.session.user.username; // Assuming the admin username is stored in the session
            await ticket.save();

            res.status(200).send("Ticket accepted successfully.");
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while accepting the ticket.");
        }
    },

    //updating ticket for admin
    async updateTicketStatus(req, res) {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const ticketNumber = req.params.ticketNumber;
            const newStatus = req.body.newStatus;
            const message = req.body.message;

            const ticket = await Ticket.findOne({ orderNum: ticketNumber });
            if (ticket.orderStatus === "CANCELLED") {
                return res.status(400).send("Cannot update a cancelled ticket.");
            } 
            
            const updatedTicket = await Ticket.findOneAndUpdate({ orderNum: ticketNumber }, { orderStatus: newStatus, messageUpdates: message }, { new: true });
            res.status(200).json(updatedTicket);
            
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while updating the ticket status.");
        }
    },

    //additional features:

    //cancell ticket for client, like if a ticket is created but not accepted yet, a client
    //can cancel it
    async cancelTicket(req, res) {
        if (!req.session.user || req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const ticketNumber = req.params.ticketNumber;
            const ticket = await Ticket.findOne({ orderNum: ticketNumber });

        if (ticket.orderStatus !== "PENDING" && ticket.orderStatus !== "ACCEPTED") {
            return res.status(400).send("Ticket cannot be cancelled.");
        }

        // Mark the ticket as cancelled and store who cancelled it
        ticket.orderStatus = "CANCELLED";
        await ticket.save();

        res.status(200).send("Ticket cancelled successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while cancelling the ticket.");
        }
    },

    //if a ticket is cancelled, it will also be shown in the admin side, and admin can delete it
    async deleteTicket(req, res) {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const ticketNumber = req.params.ticketNumber;
            await Ticket.findOneAndDelete({ orderNum: ticketNumber });
            res.status(200).send("Ticket deleted successfully.");
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while deleting the ticket.");
        }
    },
};


module.exports = ticketControl;