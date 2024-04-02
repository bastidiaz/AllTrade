const Ticket = require('../models/clientTickets.js');
const Reply = require('../models/Reply.js');

const replyControl = {
    //render of replies
    async showReplies(orderNum, req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        let replies;
        let ticket;

        const username = req.session.user.username;

        ticket = await Ticket.findOne({ orderNum: orderNum }).exec();

        try {
            if (username !== ticket.clientUsername && !req.session.user.isAdmin) {
                console.log('User is not authorized to view this ticket!');
                return res.redirect('/login');
            }
        } catch (error) {
            return res.redirect('/login');
        }

        replies = await Reply.find({ orderNum: orderNum }).exec();

        ticket = {
            orderNum: ticket.orderNum,
            creationDate: ticket.creationDate,
            orderStatus: ticket.orderStatus,
            handlerUsername: ticket.handlerUsername,
            reason: ticket.reason,
            description: ticket.description,
            specs: ticket.specs,
            quantity: ticket.quantity,
        };

        replies = replies.map(reply => {
            return {
                postedBy: reply.postedBy,
                datePosted: reply.datePosted,
                description: reply.description
            };
        });

        try {
            res.render('ticket-replies', { username: username, orderNum: orderNum, replies: replies, ticket: ticket });
        } catch (error) {
            console.error('Error fetching replies:', error);
            // Respond with an error message or render an error page.
            res.status(500).send('Error fetching replies');
        }
    },

    //create a reply
    async createReply(orderNum, req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const { description } = req.body;
        const postedBy = req.session.user.username;

        const newReply = new Reply({
            orderNum: orderNum,
            postedBy: postedBy,
            datePosted: new Date(),
            description: description
        });

        try {
            await newReply.save();
            console.log('New reply created successfully');
            res.redirect(`/tickets/${orderNum}`);
        } catch (error) {
            console.error('Error creating new reply:', error);
            res.status(500).send('Error creating new reply');
        }
    }
};


module.exports = replyControl;