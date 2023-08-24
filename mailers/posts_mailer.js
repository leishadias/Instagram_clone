const nodemailer = require('../config/nodemailer');
const ejs = require('ejs');

exports.newPost = async function(post){
    let htmlString = await nodemailer.renderTemplate({post:post},'/posts/new_post.ejs');
    nodemailer.transporter.sendMail({
       from: 'leid00123456@gmail.com',
       to: post.user.email,
       subject: "New Post Uploaded",
       html: htmlString 
    }).then((info)=>{
        console.log("mail sent", info);
        return;
    }).catch((err)=>{
        console.log("err in sending mail", err);
        return;
    });
}
