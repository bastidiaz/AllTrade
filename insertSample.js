/*This Script Is For Inserting Sample Data For Testing Purposes*/


const mongoose = require('mongoose');
const User = require("./models/User.js");



const dbURL = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'; 

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await Promise.all([
        insertSampleUsers(),
      ]);
      console.log('All sample data inserted successfully');
    } catch (error) {
      console.error('Error during data insertion:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('Connection error:', err));



async function insertSampleUsers() {
  const sampleUsers = [
    {
        companyName: "BDO corporation",
        email: "bdo@gmail.com",
        username: "bdoChing",
        password: "12345678",
        dateMade: new Date('2023-11-14T09:00:00'),
        isAdmin: false
    },
    {
        companyName: "ALLTrade",
        email: "allTrade01@gmail.com",
        username: "1EdwardoManlolos",
        password: "11111111",
        dateMade: new Date('2021-11-14T09:00:00'),
        isAdmin: true
    },
    {
        companyName: "AllTrade",
        email: "allTrade02@gmail.com",
        username: "2GraceAby",
        password: "22222222",
        dateMade: new Date('2023-11-14T09:00:00'),
        isAdmin: true
    },
    {
        companyName: "Corn Facture",
        email: "cornFact@gmail.com",
        username: "3conrFact",
        password: "33333333",
        dateMade: new Date('2020-08-14T09:00:00'),
        isAdmin: false
    }
  ];

  try {
    await User.insertMany(sampleUsers);
    console.log('Sample posts inserted successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting sample posts:', error);
  }
}