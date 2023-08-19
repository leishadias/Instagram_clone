const nodemailer = require('../config/nodemailer');

exports.resetPassword = async function(user){
    let htmlString = await nodemailer.renderTemplate({accesstoken:user.accessToken, user:user},'/user/password_reset.ejs');
    // console.log(htmlString);
    console.log("user",user);
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

exports.signupSuccess = (user) => 
{
    let htmlString = nodemailer.renderTemplate({user: user}, '/users/signup_successful.ejs');
    console.log('Inside signupSuccessful Mailer');

    nodemailer.transporter.sendMail
    (
        {
            from: 'leid00123456@gmail.com',
            to: user.email,
            subject: "Welcome to Instagram!",
            html: htmlString
        },
        (err, info) =>
        {
            if(err)
            {
                console.log('Error in sending mail', err);
                return;
            }
            //console.log('Message sent', info);
            return;
        }
    );
}