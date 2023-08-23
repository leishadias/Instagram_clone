const express = require('express');
//importing cookie parser
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
//importing express-ejs-layout
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
//passport setup
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//passport-jwt-setup
const passportJWT = require('./config/passport-jwt-strategy');
//passport google auth
const passportGoogle = require('./config/passport-google-oauth2-strategy');
//for facebook auth
const passportFacebook = require("./config/passport-facebook-strategy");
//for github auth
const passportGithub = require("./config/passport-github-strategy");
//configuring the database
const MongoStore = require('connect-mongo');

const flash= require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

//middleware for form parser
app.use(express.urlencoded());
//middleware for cookie parser
app.use(cookieParser());
//importing the assets folder
app.use(express.static('./assets'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(expressLayouts);
//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//middleware for passport
app.use(
  session({
    name: 'instagram',
    secret: 'bu9BthnFajqZjoYdeXv6v89H7CCPpm5r',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore({
      mongoUrl: 'mongodb://127.0.0.1:27017/instagram_dev',
      mongooseConnection: db,
      autoRemove: 'disabled',
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/', require('./router'));
app.listen(port, function(err){
    if (err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`Server set at port: ${port}`);
});

