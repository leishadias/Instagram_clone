const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const userMailer = require('../mailers/users_mailer');

//loading user profile
module.exports.profile = async function(req, res){
    try{
        if (req.isAuthenticated()){
            let posts = await Post.find({user: req.params.id})
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
            let user = await User.findById(req.params.id)
            .populate('followers')
            .populate('following');
            return res.render('profile', {
                title:'Instagram | Profile',
                postlist: posts,
                profile_user: user,
                all_users: users
            });
        }else{
            return res.redirect('/users/signin');
        }
    }catch(err){
        req.flash('error', err);
        console.log('error in loading profile', err);
        return;
    }
};

//signup page loading
module.exports.signup = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title:"Instagram | Sign up"
    });
};

//signin page loading
module.exports.signin = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title:"Instagram | Sign in"
    });
};

//sign in user/ create session
module.exports.createSession = function(req, res){
    req.flash('success', 'log in success');
    return res.redirect('/');
};

//create new user
module.exports.create = async function(req, res){
    try{
        //check is password and confirm password is same
        if (req.body.password != req.body.confirmPassword){
            req.flash('error', 'Confirmation password incorrect');
            return res.redirect('back');
        }
        //check if account already exists
        let user = await User.findOne({email: req.body.email});
        if (!user){
            //create new user
            user = await User.create(req.body);
            user.avatar=path.join(User.default_avatar);
            user.save();
            //send welcome mail to user
            userMailer.signupSuccess(user);
            req.flash('success', 'Account created successfully');
            return res.redirect('/users/signin');
        }else{
            req.flash('error', 'Account already exists');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};

//sign out/destroy session
module.exports.destroySession=function(req, res){
    try{
        req.logout(function(err) {
            if (err) { return next(err); }
        });
        req.flash('success', 'Logged Out Successfully');
        return res.redirect('/users/signin');
    }catch(err){
        req.flash('error', err); 
        return res.redirect('back');
    }
}

//update profile information
module.exports.update=async function(req,res){
    try{
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req,res,function(err){
            if (err){
                console.log("error in multer", err);
                return;
            }
            //only if the editing profile is of the current user
            if (req.user.id==req.params.id){
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    if (user.avatar){
                        //delete existing avatar
                        fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                    }
                    user.avatar=path.join(User.avatarPath, req.file.filename);
                }
                user.about=req.body.about;
                user.save();
                return res.redirect('back');
            }else{
                return res.status(401).send('Unauthorised');
            }
        });
    }catch(err){
        req.flash('error', err); 
        return res.redirect('back');
    }
}

//reset password page loading (enter mail address)
module.exports.resetPassword = function(req, res)
{
    try{
        return res.render('reset_password',
        {
            title: 'Instagram | Reset Password',
            access: false
        });
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

//send change password link to mail
module.exports.resetPassMail = async function(req, res)
{
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            if(user.isTokenValid == false)
            {
                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                user.save();
            }
            userMailer.resetPassword(user);
            req.flash('success', 'Password reset link sent to mail');
            return res.redirect('/users/signin');
        }else{
            console.log('User not found. Try again!');
            req.flash('error', 'User not found. Try again!');
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

//set new password page loading
module.exports.setPassword = async function(req, res)
{
    try{
        let user = await User.findOne({accessToken: req.params.accessToken});
        if(user.isTokenValid == true)
        {
            return res.render('reset_password',
            {
                title: 'Instagram | Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

//update password
module.exports.updatePassword = async function(req, res)
{
    try{
        let user = await User.findOne({accessToken: req.params.accessToken});
        if(user.isTokenValid)
        {
            if(req.body.newPass == req.body.confirmPass)
            {
                user.password = req.body.newPass;
                //set token valid as false
                user.isTokenValid = false;
                user.save();
                req.flash('success', "Password updated. Login now!");
                return res.redirect('/users/signin') 
            }
            else
            {
                req.flash('error', "Passwords don't match");
                return res.redirect('back');
            }
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
}
