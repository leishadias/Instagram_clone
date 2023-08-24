const nodemailer = require('../config/nodemailer');

//mail to reset password
exports.resetPassword = async function(user){
    let htmlString = await nodemailer.renderTemplate({user:user},'/user/password_reset.ejs');
    nodemailer.transporter.sendMail({
       from: 'leid00123456@gmail.com',
       to: user.email,
       subject: "Reset Instagram password",
       html: htmlString 
    }).then((info)=>{
        console.log("mail sent", info);
        return;
    }).catch((err)=>{
        console.log("err in sending mail", err);
        return;
    });
}

//mail un successful account creation
exports.signupSuccess = async function(user){
    let htmlString = await nodemailer.renderTemplate({user: user}, '/user/signup_successful.ejs');
    nodemailer.transporter.sendMail({
        from: 'leid00123456@gmail.com',
        to: user.email,
        subject: "Welcome to Instagram!",
        html: htmlString
    }).then((info)=>{
        console.log("mail sent", info);
        return;
    }).catch((err)=>{
        console.log("err in sending mail", err);
        return;
    });
}