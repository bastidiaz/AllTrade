const mongoose = require('mongoose');
const User = require("./models/User.js");
const ClientTicket = require("./models/clientTickets.js");
const bcrypt = require('bcrypt');

const dbURL = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'; 

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

// async function insertSampleUsers() {
//   const sampleUsers = [
//     {
//         companyName: "BDO corporation",
//         email: "bdo@gmail.com",
//         username: "bdoChing",
//         password: await bcrypt.hash("12345678", 10), // Hash the password before inserting
//         dateMade: new Date('2023-11-14T09:00:00'),
//         isAdmin: false
//     },
//     {
//         companyName: "ALLTrade",
//         email: "allTrade01@gmail.com",
//         username: "1EdwardoManlolos",
//         password: await bcrypt.hash("11111111", 10), // Hash the password before inserting
//         dateMade: new Date('2021-11-14T09:00:00'),
//         isAdmin: true
//     },
//     {
//         companyName: "AllTrade",
//         email: "allTrade02@gmail.com",
//         username: "2GraceAby",
//         password: await bcrypt.hash("22222222", 10), // Hash the password before inserting
//         dateMade: new Date('2023-11-14T09:00:00'),
//         isAdmin: true
//     },
//     {
//         companyName: "Corn Facture",
//         email: "cornFact@gmail.com",
//         username: "3conrFact",
//         password: await bcrypt.hash("33333333", 10), // Hash the password before inserting
//         dateMade: new Date('2020-08-14T09:00:00'),
//         isAdmin: false
//     }
//   ];

//   try {
//     await User.insertMany(sampleUsers);
//     console.log('Sample users inserted successfully');
//   } catch (error) {
//     console.error('Error inserting sample users:', error);
//   }
// }

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
