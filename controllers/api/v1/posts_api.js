const Post = require('../../../models/post');
const Comment = require('../../../models/comments');

module.exports.index = async function(req,res){
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user', 'name email')
        .populate({
            path: 'comments',
            populate: [
                { path: 'user'},
                { path: 'likes' }
            ]
        }).populate('likes');

        res.status(200).json({
        message: "List of posts of v1",
        posts:posts
    })
}

module.exports.destroy = async function(req, res){
    try {
        const currpost = await Post.findById(req.params.id);
        if (currpost.user.toString() == req.user.id){
            fs.unlinkSync(path.join(__dirname,"..",currpost.imgpath)); //delete from folder
            await Like.deleteMany({likeable: currpost, onModel: 'Post'}); //delete likes
            await Like.deleteMany({_id: {$in: currpost.comments}});
            await Post.deleteOne({ _id: req.params.id }); //delete post
            await Comment.deleteMany({post: req.params.id}); //delete all comments
            await User.findByIdAndUpdate(req.user.id, {$pull:{posts:req.params.id}}); //delete post from user

            res.status(200).json({
                message: "Posts and associated comments and likes deleted"
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