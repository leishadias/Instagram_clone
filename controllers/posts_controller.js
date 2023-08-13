const Post = require('../models/post');
const Comment = require('../models/comments');
const path=require('path');

module.exports.create = async function(req, res){
    try{
        // let user = await User.findById(req.params.id);
        Post.uploadedImg(req,res,async function(err){
            if (err){
                console.log("error in multer", err);
                return;
            }
            let post = await Post.create({
                imgpath: path.join(Post.imgPath, req.file.filename), 
                caption: req.body.caption,
                user: req.user._id
            });
            
            if (req.xhr){
                // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
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

module.exports.destroy = async function(req, res){
    try {
        const currpost = await Post.findById(req.params.id);
        if (!currpost) {
            req.flash('error', 'Post not found');
          return res.redirect('back');
        }
        if (currpost.user.toString() == req.user.id){
            await Post.deleteOne({ _id: req.params.id }); 
            await Comment.deleteMany({post: req.params.id});
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
        return res.redirect('back');
      }
};

module.exports.createPost = async function(req, res){
    try{
        return res.render('create', {
            title:"home"
            });
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};