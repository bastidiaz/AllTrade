const Ticket = require('../models/clientTickets.js');
const User = require('../models/User.js');
const moment = require('moment');

const ticketControl = {
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
                tickets = await Ticket.find({ clientUsername: username }).exec();
            }
    
            tickets = tickets.map(ticket => {
                const formattedDate = moment(ticket.creationDate).format('MMMM D, YYYY hh:mm a');
                return {
                    orderNum: ticket.orderNum,
                    creationDate: formattedDate,
                    orderStatus: ticket.orderStatus,
                    handlerUsername: ticket.handlerUsername,
                    reason: ticket.reason,
                    description: ticket.description,
                    specs: ticket.specs,
                    quantity: ticket.quantity,
                    messageUpdates: ticket.messageUpdates,
                };
            });
    
            if (!tickets || tickets.length === 0) {
                return res.render("tickets", { tickets: [], username: req.session.user.username, companyName: req.session.user.companyName });
            }
            if (req.session.user.isAdmin) {
                res.render("all-tickets", { tickets: tickets, admin: req.session.user });
            } else {
                res.render("tickets", { tickets: tickets, username: req.session.user.username, companyName: req.session.user.companyName });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching tickets.");
        }
    },

    // admin view, tickets handled by admin
    async showHandledTickets(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        try {
            let tickets;

            if (!req.session.user.isAdmin) {
                return res.status(401).send("Unauthorized");
            }

            const handler = req.session.user.username;
            tickets = await Ticket.find({ handlerUsername: handler }).exec();

            tickets = tickets.map(ticket => {
                const formattedDate = moment(ticket.creationDate).format('MMMM D, YYYY hh:mm a');
                return {
                    orderNum: ticket.orderNum,
                    creationDate: formattedDate,
                    orderStatus: ticket.orderStatus,
                    handlerUsername: ticket.handlerUsername,
                    reason: ticket.reason,
                    description: ticket.description,
                    specs: ticket.specs,
                    quantity: ticket.quantity,
                    messageUpdates: ticket.messageUpdates,
                };
            });

            if (!tickets || tickets.length === 0) {
                return res.render("tickets-handled", { tickets: [], username: req.session.user.username, companyName: req.session.user.companyName });
            }
            res.render("tickets-handled", { tickets: tickets, admin: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching tickets.");
        }
    },

    async createTicket(req, res) {
        if (!req.session.user || req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }
        
        const username = req.session.user.username;
        const { reason, description, specs, quantity } = req.body;
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return res.status(404).send("User not found");
            }

            const newTicket = new Ticket({
                clientUsername: username,
                creationDate: new Date(),
                reason: reason,
                description: description,
                specs: specs,
                quantity: quantity
            });

            await newTicket.save();
            console.log("Ticket created successfully:", newTicket);
            res.redirect(`/tickets`);
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
            const orderNum = req.body.orderNum;
            const ticket = await Ticket.findOne({ orderNum: orderNum });

            if (ticket.orderStatus !== "PENDING") {
                return res.status(400).send("Ticket cannot be accepted.");
            }

            // Update ticket status to "ACCEPTED" and store the admin who handled it
            ticket.orderStatus = "ACCEPTED";
            ticket.handlerUsername = req.session.user.username; // Assuming the admin username is stored in the session
            await ticket.save();

            console.log("Ticket accepted successfully.");
            res.redirect(`/all-tickets`);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while accepting the ticket.");
        }
    },

    //reject ticket by admin
    async rejectTicket(req, res) {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const orderNum = req.body.orderNum;
            const ticket = await Ticket.findOne({ orderNum: orderNum });

            if (ticket.orderStatus !== "PENDING") {
                return res.status(400).send("Ticket cannot be rejected.");
            }

            // Update ticket status to "ACCEPTED" and store the admin who handled it
            ticket.orderStatus = "REJECTED";
            ticket.handlerUsername = req.session.user.username; // Assuming the admin username is stored in the session
            await ticket.save();

            console.log("Ticket rejected successfully.");
            res.redirect(`/all-tickets`);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while accepting the ticket.");
        }
    },

    //updating ticket for admin
    async updateTicket(req, res) {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const orderNum = req.body.orderNum;
            let ticket = await Ticket.findOne({orderNum: orderNum});

            if (!ticket) {
                return res.status(404).send("Ticket not found.");
            }

            const {orderStatus, handlerUsername, description, specs, quantity} = req.body;

            ticket = await Ticket.findOneAndUpdate({orderNum: orderNum}, {
                orderStatus: orderStatus,
                handlerUsername: handlerUsername,
                description: description,
                specs: specs,
                quantity: quantity
            }, {new: true});

            console.log("Ticket updated successfully.");

            res.redirect("/tickets-handled")
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while updating the ticket.");
        }
    },

    async changePass(req, res) {
        const user = req.session.user;
        const { oldPassword, newPassword } = req.body;
        try {
            const userFromDB = await User.findById(user._id); // Assuming you have a User model
    
            if (!userFromDB) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const samePass = await bcrypt.compare(oldPassword, userFromDB.password);
    
            if (samePass) {
                const hashedNewPass = await bcrypt.hash(newPassword, 10); // Hash the new password
    
                // Update the user's password in the database
                await User.findByIdAndUpdate(user._id, { password: hashedNewPass });
    
                res.status(200).json({ message: 'Password updated successfully' });
            } else {
                res.status(400).json({ error: 'Old password is incorrect' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    //additional features:

    //cancell ticket for client, like if a ticket is created but not accepted yet, a client
    //can cancel it
    // async cancelTicket(req, res) {
    //     if (!req.session.user || req.session.user.isAdmin) {
    //         return res.status(401).send("Unauthorized");
    //     }
    //
    //     try {
    //         const ticketNumber = req.params.ticketNumber;
    //         const ticket = await Ticket.findOne({ orderNum: ticketNumber });
    //
    //     if (ticket.orderStatus !== "PENDING" && ticket.orderStatus !== "ACCEPTED") {
    //         return res.status(400).send("Ticket cannot be cancelled.");
    //     }
    //
    //     // Mark the ticket as cancelled and store who cancelled it
    //     ticket.orderStatus = "CANCELLED";
    //     await ticket.save();
    //
    //     res.status(200).send("Ticket cancelled successfully.");
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send("An error occurred while cancelling the ticket.");
    //     }
    // },

    // //if a ticket is cancelled, it will also be shown in the admin side, and admin can delete it
    // async deleteTicket(req, res) {
    //     if (!req.session.user || !req.session.user.isAdmin) {
    //         return res.status(401).send("Unauthorized");
    //     }
    //
    //     try {
    //         const ticketNumber = req.params.ticketNumber;
    //         await Ticket.findOneAndDelete({ orderNum: ticketNumber });
    //         res.status(200).send("Ticket deleted successfully.");
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("An error occurred while deleting the ticket.");
    //     }
    // },
};


module.exports = ticketControl;