const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'leid00123456@gmail.com',
        pass: 'ocdcbdklaqmqecyl'
    }
});

let renderTemplate = async (data, relativePath)=>{
    try {
        const mailHtml = await ejs.renderFile(
            path.join(__dirname, '../views/mailers', relativePath),
            data
        );
        return mailHtml;
    } catch (err) {
        console.log("error in rendering template", err);
    }
};

module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
};