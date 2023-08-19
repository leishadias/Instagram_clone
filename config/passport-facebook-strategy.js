const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//creating passport strategy
passport.use(new FacebookStrategy({
    clientID : "969567850762354",
    clientSecret : "cb6c28e25be2da60804428a47b13850f",
    callbackURL :  "http://localhost:8000/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    function(accessToken, refreshToken, profile, done){
        // console.log("profile",profile);
        User.findOne({email: profile.id}).exec().then(function(user){
            
            if (user){
                //if found, set this user as request.user
                return done(null, user);
            }else{
                //if not found, then create the user and set it as req.user 
                User.create({
                    name: profile.displayName,
                    email: profile.id,
                    password: crypto.randomBytes(20).toString('hex')
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