const Post = require('../models/post');
const User = require('../models/user');

module.exports.explore = async function(req, res){
    try{
        if (req.isAuthenticated()){
            let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            })
            .populate('likes');
            let users = await User.find({});
            return res.render('explore', {
                title:"explore",
                postlist: posts,
                all_users: users
                });
        }else{
            return res.redirect('/users/signin');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};