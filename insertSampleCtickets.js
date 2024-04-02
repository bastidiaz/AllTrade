const mongoose = require('mongoose');
const User = require("./models/User.js");
const ClientTicket = require("./models/clientTickets.js");
const bcrypt = require('bcrypt');

// const dbURL = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'; 
const dbURL = "mongodb+srv://franceeee09:_apdev2223@fairyfloss.lucgr7f.mongodb.net/?retryWrites=true&w=majority&appName=fairyfloss";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
    //   await insertSampleUsers();
      await insertSampleTickets();
      console.log('All sample data inserted successfully');
    } catch (error) {
      console.error('Error during data insertion:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('Connection error:', err));

async function insertSampleTickets() {
  try {
    const users = await User.find({ isAdmin: false }); // Fetching non-admin users
    const sampleTickets = [];

    if (users.length > 0) {
      for (let i = 0; i < 5; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]; // Selecting a random non-admin user
        const ticketData = new ClientTicket({
          clientName: `${randomUser.firstname} ${randomUser.lastname}`,
          creationDate: new Date(),
          prioLevel: Math.floor(Math.random() * 5) + 1 + '', // Convert number to string
          capacityUtilization: Math.floor(Math.random() * 100) + 1,
          orderStatus: 'PENDING',
          otherDetails: `Sample details for ticket ${i + 1}`
        });
        sampleTickets.push(ticketData);
      }

      await ClientTicket.insertMany(sampleTickets);
      console.log('Sample tickets inserted successfully');
    } else {
      console.log('No non-admin users found.');
    }
  } catch (error) {
    console.error('Error during sample ticket insertion:', error);
  }
}
