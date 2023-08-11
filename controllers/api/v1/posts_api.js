const Post = require('../../../models/post');
const Comment = require('../../../models/comments');



module.exports.index = async function(req,res){
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        res.status(200).json({
        message: "List of posts of v1",
        posts:posts
    })
}

module.exports.destroy = async function(req, res){

    try {
        const currpost = await Post.findById(req.params.id);
        if (currpost.user.toString() == req.user.id){
            await Post.deleteOne({ _id: req.params.id }); 
            await Comment.deleteMany({post: req.params.id});

            res.status(200).json({
                message: "Posts and associated comment deleted"
            });
        }else{
            res.status(500).json({
                message: "You cannot delete this post"
            });
        }
            
      } catch (err) {
        console.log(err);
        return res.status(500).json( {
            message: "Internal server error"
        });
      }
};