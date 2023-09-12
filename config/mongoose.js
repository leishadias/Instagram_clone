const mongoose = require('mongoose');
const env = require('./environment');

mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'couldnt connect to mongo'));
db.once('open',function(){
    console.log('connected to db');
});
module.exports=db;