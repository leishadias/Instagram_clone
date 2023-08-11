const nodemailer = require('../config/nodemailer');
const ejs = require('ejs');

exports.newComment = async function(comment){
    let htmlString = await nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    console.log(htmlString);
    nodemailer.transporter.sendMail({
       from: 'leishadias18@gmail.com',
       to: comment.user.email,
       subject: "New comment published",
       html: htmlString 
    }).then((info)=>{
        console.log("mail sent", info);
        return;
    }).catch((err)=>{
        console.log("err in sending mail", err);
        return;
    });
}