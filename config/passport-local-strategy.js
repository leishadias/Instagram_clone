const passport = require('passport');
const User = require('../models/user');
const LocalStratergy = require('passport-local').Strategy;

//authentication using passport
passport.use(new LocalStratergy({
  usernameField: 'email',
  passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ email: email }).then(
      function (user) {
        if (!user || user.password!=password) { 
          req.flash('error', 'Invalid username or password'); 
          return done(null, false); 
        }
        return done(null, user);
      }
    ).catch((err)=>{
      req.flash('error', err); 
      return done(err); 
    });
  }
));

//serializing the user to know which key is present in cookie
passport.serializeUser(function(user,done){
  done(null, user.id);
});

//deserializing the user from the key in cookie
passport.deserializeUser(function(id, done){
  User.findById(id).then(
    function(user){
      return done(null, user);
    }
  ).catch(
    (err)=>{
      console.log('couldnt find user - deserialized');
      return done(err);
    });
});

passport.checkAuthentication= function(req,res,next){
  //if user is signed in then pass the requset to next function
  if(req.isAuthenticated()){
    return next();
  }
  //if not signed in then redirect to sign-in page
  return res.redirect('/users/signin');
}

passport.setAuthenticatedUser= function(req,res,next){
  //storing value in locals so that it can be used in ejs
  if(req.isAuthenticated()){
    res.locals.user = req.user;
  }
  next();
}

module.exports=passport;
  