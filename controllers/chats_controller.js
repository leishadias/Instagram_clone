// const Post = require('../models/post');
const User = require('../models/user');

module.exports.inbox = async function(req, res){
    try{
        let users = await User.find({});
        return res.render('inbox', {
            title:"chats",
            all_users: users
            });
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};

