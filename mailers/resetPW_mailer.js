const nodemailer = require('../config/nodemailer');

exports.resetPassword = async function(user){
    let htmlString = await nodemailer.renderTemplate({accesstoken:user.accesstoken},'/comments/new_comment.ejs');
    // console.log(htmlString);
    nodemailer.transporter.sendMail({
       from: 'leishadias18@gmail.com',
       to: user.user.email,
       subject: "Reset codeial password",
       html: htmlString 
    }).then((info)=>{
        console.log("mail sent", info);
        return;
    }).catch((err)=>{
        console.log("err in sending mail", err);
        return;
    });
}