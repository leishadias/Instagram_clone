const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comments');
const Like = require('../models/like');
const fs = require('fs');
const path=require('path');
const postsMailer = require('../mailers/posts_mailer');

//create new post
module.exports.create = async function(req, res){
    try{
        Post.uploadedImg(req,res,async function(err){
            if (err){
                console.log("error in multer", err);
                return;
            }
            let user = await User.findById(req.user.id);
            let post = await Post.create({
                imgpath: path.join(Post.imgPath, req.file.filename), 
                caption: req.body.caption,
                user: req.user._id
            });
            user.posts.push(post);
            await user.save();
            await post.populate('user', 'name email');
            postsMailer.newPost(post);
            
            if (req.xhr){
                post = await post.populate('user','name');
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: "Post created!"
                });
            }
            req.flash('success', 'Post created successfully');
            return res.redirect('/');
        });

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};

//delete post
module.exports.destroy = async function(req, res){
    try {
        const currpost = await Post.findById(req.params.id);
        if (!currpost) {
            req.flash('error', 'Post not found');
            return res.redirect('back');
        }
        if (currpost.user.toString() == req.user.id){
            fs.unlinkSync(path.join(__dirname,"..",currpost.imgpath)); //delete from folder
            await Like.deleteMany({likeable: currpost, onModel: 'Post'}); //delete likes
            await Like.deleteMany({_id: {$in: currpost.comments}});
            await Post.deleteOne({ _id: req.params.id }); //delete post
            await Comment.deleteMany({post: req.params.id}); //delete all comments
            await User.findByIdAndUpdate(req.user.id, {$pull:{posts:req.params.id}}); //delete post from user
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "post deleted"
                });
            } 
            req.flash('success', 'Post deleted successfully');
        }
        return res.redirect('back');
      } catch (err) {
        req.flash('error', err);
        console.log(err);
        return res.redirect('back');
      }
};

//load page for post creation
module.exports.createPost = async function(req, res){
    try{
        let users = await User.find({});
        if (req.isAuthenticated()){
            return res.render('create', {
                title:"Instagram | Create",
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