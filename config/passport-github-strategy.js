const passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const path = require('path');


//creating passport strategy
passport.use(new GitHubStrategy({
    clientID : "********",
    clientSecret : "*******",
    callbackURL :  "http://localhost:8000/users/auth/github/callback"
},
function(accessToken, refreshToken, profile, done){
    User.findOne({email: profile.username}).exec().then(function(user){
        
        if (user){
            //if found, set this user as request.user
            return done(null, user);
        }else{
            //if not found, then create the user and set it as req.user 
            User.create({
                name: profile.username,
                email: profile.id,
                password: crypto.randomBytes(20).toString('hex'),
                avatar: path.join(User.default_avatar)
            }).then(function(user){
                return done(null, user); 
            }).catch((err)=>{
                console.log('error in passport-github-oauth', err);
                return;
            });
        }
    }).catch((err)=>{
        console.log('error in passport-github-oauth', err);
        return;
    });
}))

module.exports = passport;
