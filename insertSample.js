/* This Script Is For Inserting Sample Data For Testing Purposes */

const mongoose = require('mongoose');
const User = require("./models/User.js");
const bcrypt = require('bcrypt');

//const dbURL = 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/?retryWrites=true&w=majority&appName=blabdue'; 
const dbURL = "mongodb+srv://franceeee09:_apdev2223@fairyfloss.lucgr7f.mongodb.net/?retryWrites=true&w=majority&appName=fairyfloss";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await insertSampleUsers();
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
        password: await bcrypt.hash("12345678", 10), // Hash the password before inserting
        dateMade: new Date('2023-11-14T09:00:00'),
        isAdmin: false,
        firstname: "John",
        lastname: "Ching"
    },
    {
        companyName: "ALLTrade",
        email: "allTrade01@gmail.com",
        username: "1EdwardoManlolos",
        password: await bcrypt.hash("11111111", 10), // Hash the password before inserting
        dateMade: new Date('2021-11-14T09:00:00'),
        isAdmin: true,
        firstname: "Edwardo",
        lastname: "Manlolos"
    },
    {
        companyName: "AllTrade",
        email: "allTrade02@gmail.com",
        username: "2GraceAby",
        password: await bcrypt.hash("22222222", 10), // Hash the password before inserting
        dateMade: new Date('2023-11-14T09:00:00'),
        isAdmin: true,
        firstname: "Grace",
        lastname: "Aby"
    },
    {
        companyName: "Corn Facture",
        email: "cornFact@gmail.com",
        username: "3conrFact",
        password: await bcrypt.hash("33333333", 10), // Hash the password before inserting
        dateMade: new Date('2020-08-14T09:00:00'),
        isAdmin: false,
        firstname: "Adon",
        lastname: "Corn"
    }
  ];

  try {
    await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully');
  } catch (error) {
    console.error('Error inserting sample users:', error);
  }
}
