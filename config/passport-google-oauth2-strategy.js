const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const path = require('path');

//tell passport to use new strategy for goolgle login
passport.use(new googleStrategy({
        clientID: '705415517906-a00ql2m0vmm7cpoe8qlc4prgjl8219jd.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8000/users/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec().then(function(user){
            // console.log(profile);
            if (user){
                //if found, set this user as request.user
                return done(null, user);
            }else{
                //if not found, then create the user and set it as req.user 
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    avatar: path.join(User.default_avatar)
                }).then(function(user){
                    return done(null, user); 
                }).catch((err)=>{
                    console.log("error in google strategy passport", err);
                    return;
                });
            }
        }).catch((err)=>{
            console.log("error in google strategy passport", err);
            return;
        });
    }
));

module.exports=passport;