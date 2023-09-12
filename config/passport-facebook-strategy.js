const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const path = require('path');
const env = require('./environment');

//creating passport strategy
passport.use(new FacebookStrategy({
    clientID : env.facebook_client_id,
    clientSecret : env.facebook_client_secret,
    callbackURL : env.facebook_call_back_url,
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.id}).exec().then(function(user){
            
            if (user){
                //if found, set this user as request.user
                return done(null, user);
            }else{
                //if not found, then create the user and set it as req.user 
                User.create({
                    name: profile.displayName,
                    email: profile.id,
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
))

module.exports = passport;