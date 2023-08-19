const User = require('../models/user');

module.exports.create = async function(req,res){
    try{
        if (req.isAuthenticated()){
            let fromUser = await User.findById(req.user._id);
            let toUser = await User.findById(req.query.toid);
            if(!fromUser.following.includes(req.query.toid)){
                fromUser.following.push(req.query.toid);
                fromUser.save();
                toUser.followers.push(req.user._id);
                toUser.save();
                req.flash('success','Followed');
            }else{
                req.flash('error','You already follow this person');
            }
            return res.redirect('back');
        }else{
            return res.redirect('/users/signin');
        }
    }catch(err){
        console.log("Error in following", err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        if (req.isAuthenticated()){
            let fromUser = await User.findById(req.user._id);
            let toUser = await User.findById(req.query.toid);

            await User.findByIdAndUpdate(fromUser,{$pull : {following : req.query.toid}});
            await User.findByIdAndUpdate(toUser,{$pull : {followers : req.user._id}});

            req.flash('success','Unfollowed');
            return res.redirect('back');
        }else{
            return res.redirect('/users/signin');
        }
    }catch(err){
        console.log("Error in unfollowing", err);
        return res.redirect('back');
    }
}