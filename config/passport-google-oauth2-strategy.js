const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const path = require('path');
const env = require('./environment');

//tell passport to use new strategy for goolgle login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec().then(function(user){
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
