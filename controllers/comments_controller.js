const Comments = require('../models/comments');
const Post = require('../models/post');
const Like = require('../models/like');

//create comment
module.exports.create = async function (req, res) {
  try {
    if (req.isAuthenticated()){
      let post = await Post.findById(req.body.post);
      if (!post) {
        req.flash('error', 'Post not found while creating comment'); 
        return res.redirect('back');
      }
      let comment = await Comments.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });

      post.comments.push(comment);
      await post.save();
      await comment.populate('user','name email avatar');
      
      if(req.xhr){
        return res.status(200).json({
            data: {
              comment: comment
            },
            message: "comment created"
        });
      }
      req.flash('success', 'Comment updated successfully');
      return res.redirect('/');
    }else{
      return res.redirect('/users/signin');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};

//delete comment
module.exports.destroy = async function(req, res){
  try{
    if (req.isAuthenticated()){
      let comment = await Comments.findById(req.params.id);
      let postId = comment.post;
      let post = await Post.findById(postId).populate('user');
      if (comment.user.toString() == req.user.id || post.user._id.toString()==req.user.id){
        
        await Comments.deleteOne({ _id: req.params.id });
        await Post.findByIdAndUpdate(postId, {$pull:{comments:req.params.id}});
        await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
        if(req.xhr){
          return res.status(200).json({
              data: {
                  comment_id: req.params.id
              },
              message: "comment deleted"
          });
          
        } 
        req.flash('success', 'Comment deleted successfully');
      } 
      return res.redirect('back');
    }else{
      return res.redirect('/users/signin');
    }
  } catch(err){
    req.flash('error', err);
    return res.redirect('back');
  }
};