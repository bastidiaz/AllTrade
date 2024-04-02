/* This Script Is For Inserting Sample Data For Testing Purposes */

const mongoose = require('mongoose');
const User = require("./models/User.js");
const bcrypt = require('bcrypt');
const ClientTicket = require("./models/clientTickets");
const Reply = require("./models/Reply.js");

//const dbURL = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'; 
const dbURL = "mongodb+srv://franceeee09:_apdev2223@fairyfloss.lucgr7f.mongodb.net/?retryWrites=true&w=majority&appName=fairyfloss";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await insertSampleReplies();
      console.log('All sample data inserted successfully');
    } catch (error) {
      console.error('Error during data insertion:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('Connection error:', err));

async function insertSampleReplies() {
    try {
        // Fetch all tickets
        const tickets = await ClientTicket.find();
        const sampleReplies = [];

        // For each ticket, insert 2 sample replies
        for (const ticket of tickets) {
            for (let i = 0; i < 2; i++) {
                const newReply = new Reply({
                    orderNum: ticket.orderNum,
                    postedBy: ticket.clientUsername,
                    datePosted: new Date(), // Use current date/time for simplicity
                    description: `Sample reply ${i + 1} for ticket ${ticket.orderNum}`
                });
                sampleReplies.push(newReply);
            }
        }

        await Reply.insertMany(sampleReplies);
        console.log('Sample replies inserted successfully');
    } catch (error) {
        console.error('Error inserting sample replies:', error);
        mongoose.disconnect();
    }
}