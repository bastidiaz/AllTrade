const Inquiry = require("../models/inquiryForm");

const inquiryControl = { 
    async sendInquiry(req, res){
       try{
        const {firstName, lastName, companyName, email, phoneNumber, message} = req.body;
        const newInquiry = new Inquiry({
            firstName,
            lastName,
            companyName,
            email,
            phoneNumber,
            message
        });

        await newInquiry.save();
        res.status(200).json({ message: 'Your inquiry has been sent!' });
       }
       catch (error){
        console.error(error);
        res.status(500).json({ message: 'Failed to send inquiry.' });
       } 
    }
}

module.exports = inquiryControl;