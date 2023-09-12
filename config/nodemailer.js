const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

let transporter = nodemailer.createTransport(env.smtp);

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